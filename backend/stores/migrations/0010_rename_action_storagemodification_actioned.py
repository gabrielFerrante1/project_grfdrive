# Generated by Django 4.1.3 on 2022-11-12 00:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0009_remove_storagemodification_action_codename_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='storagemodification',
            old_name='action',
            new_name='actioned',
        ),
    ]
