# Generated by Django 4.1.3 on 2022-11-11 20:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0004_alter_storage_table_alter_storageowner_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='StorageAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'storages_action',
            },
        ),
        migrations.CreateModel(
            name='StorageModification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('action', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.storageaction')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.storageowner')),
                ('storage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.storage')),
            ],
            options={
                'db_table': 'storages_modification',
            },
        ),
    ]