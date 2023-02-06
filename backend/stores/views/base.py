from rest_framework.views import APIView

from django.db.models import Q
from rest_framework.exceptions import APIException

from ..models import Storage, StorageOwner, StorageModification, StorageAction 


class Base(APIView):
    def get_storages(self, **kwargs):
        '''
        Get all filter-based storages

            Parameters:
                **kwargs: Model Storage queryset

            Returns:
                Returns a list of storages
        '''
        
        storage_owners = StorageOwner.objects.filter(**kwargs)
        
        storages = []
        for item in storage_owners:
            storage = Storage.objects.filter(
                id=item.storage_id
            ).first()
            
            if storage: storages.append(storage)

        return storages
    
    def get_type_of_extension(self, extension):
        '''
        Get file type via extension

            Parameters:
                extension(str): File extension

            Returns:
                Returns file type
        ''' 

        if extension != None:
            extension = extension.title()

            type_storage = extension
            if "Txt" == extension or \
               "Docx" == extension:
                type_storage = "Texto"

            if "Mp3" == extension or \
               "Wma" == extension or \
               "Aac" == extension or \
               "Ogc" == extension or \
               "Ac3" == extension or \
               "Wav" == extension:
                type_storage = "Áudio"

            if "Mpeg" == extension or \
               "Mov" == extension or \
               "Rmvb" == extension or \
               "Mkv" == extension or \
               "Avi" == extension:
                type_storage = "Vídeo"

            if "Gif" == extension or \
               "Bmp" == extension or \
               "Jpeg" == extension or \
               "Png" == extension or \
               "Jpg" == extension:
                type_storage = "Imagem"
        else:
            type_storage = 'Pasta'
    
        return type_storage

    def check_if_exists_directory_by_id(self, user_id, storage_id):
        '''
        Check if a folder exists and if it really is a folder, via storage_id

            Parameters:
                user_id(int): User id
                storage_id(int): Storage id

            Returns:
                Returns True or Raise for folder existence
        '''
        if storage_id == '0': return True
 
        check_storage = self.get_storages(
            user_id=user_id, 
            storage_id=storage_id,
            storage_is_deleted=False
        )

        for storage in check_storage:
            if storage.extension != None: raise APIException("Você não pode criar pastas dentro de um arquivo", 'invalid_validators')

        if not check_storage: raise APIException("A pasta superior não existe ou foi deletada", 'invalid_validators')
 

    def create_an_modification(self, user_id, storage_id, codename, visible_all=True):
        '''
        Add a modification to the database for some storage

            Parameters:
                user_id(int): User id
                storage_id(int): Storage id
                codename (str): Codename of action
                visible_all(bool) Optional: If's visible all owners

            Returns:
                Returns None
        '''

        if storage_id == '0': return None
    
        where_object = [
            Q(user_id=user_id),
            Q(storage_higher_level_id=storage_id) |
            Q(storage_id=storage_id)
        ] 

        owner = StorageOwner.objects.filter(*where_object).first()

        StorageModification.objects.create(
            visible_all=visible_all,
            action_codename=StorageAction.objects.filter(codename=codename).first(),
            storage_id=storage_id,
            owner_id=owner.id,
        )

    def check_if_storage_higher_level_exists_by_name(self, user_id, storage_higher_level_id, file_name, file_extension):
        '''
        Check if a folder or file with that name already exists in a given storage

            Parameters:
                user_id(int): User id
                storage_higher_level_id(int): Storage higher level id of an storage
                file_name (str): File name
                file_extension(bool): File extension

            Returns:
                Returns None or Raise exception
        '''

        # Get storages
        storages = self.get_storages(
            user_id=user_id, 
            storage_higher_level_id=storage_higher_level_id, 
            storage_is_deleted=False
        )

        # Filter and check storage for name
        for storage in storages:
            if storage.name == file_name and storage.extension == file_extension:
                message = "A pasta {name} já existe".format(name=file_name)
    
                if file_extension:
                    message = "O arquivo {name} já existe".format(name=file_name + '.' + file_extension)

                raise APIException(message, 'invalid_validators')
 
    def get_first_degree_children_from_storage(self, user_id, storage_higher_level_id, **kwargs):
        '''
        Get all folders and child files of a storage

            Parameters:
                user_id(int): User id
                storage_higher_level_id(int): Storage higher level id of an storage
                delete_storage (bool): Delete storage
                **kwargs: Model StorageOwner queryset

            Returns:
                Returns a list of ids, of storaga's child folders and files
        ''' 
        children_storages = []

        storages = StorageOwner.objects.filter(
            storage_higher_level_id=storage_higher_level_id, 
            user_id=user_id, 
            **kwargs
        )

        for storage in storages:
            children_storages.append(storage.storage_id)

        return children_storages

    def get_all_children_from_a_store(self, user_id, list, **kwargs):
        '''
        Get all folders and child files of a storage, this function will get everything from start to finish

            Parameters:
                user_id(int): User id
                list(int[]): List that the get_first_degree_children_from_storage function returns 
                **kwargs: Model StorageOwner queryset

            Returns:
                Returns a list of ids, of storaga's child folders and files
        '''

        children_storages = list

        for storage_higher_level_id in list:
            storages_childrens = self.get_first_degree_children_from_storage(
                user_id=user_id, 
                storage_higher_level_id=storage_higher_level_id,
                **kwargs
            )

            for storage_higher_level_id2 in storages_childrens:
                children_storages.append(storage_higher_level_id2)

        return children_storages 