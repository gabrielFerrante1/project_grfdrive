# Generated by Django 4.1.3 on 2022-11-10 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storage_owner',
            name='storage_higher_level_id',
            field=models.IntegerField(),
        ),
    ]