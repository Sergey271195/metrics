# Generated by Django 3.1.1 on 2020-10-06 21:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectapi', '0003_webpage_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
