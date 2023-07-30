# Generated by Django 4.1.3 on 2022-12-18 21:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0017_remove_storageowner_storage_root_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='StorageShare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_user', models.IntegerField()),
                ('to_user', models.IntegerField()),
                ('status', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'storages_share',
            },
        ),
        migrations.CreateModel(
            name='StorageShareStorage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('share', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.storageshare')),
                ('storage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.storage')),
            ],
            options={
                'db_table': 'storages_share_storage',
            },
        ),
    ]