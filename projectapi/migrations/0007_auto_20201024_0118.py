# Generated by Django 3.1.1 on 2020-10-23 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectapi', '0006_project_jandexid'),
    ]

    operations = [
        migrations.AddField(
            model_name='webpage',
            name='create_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='webpage',
            name='url',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
