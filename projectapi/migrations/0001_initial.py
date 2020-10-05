# Generated by Django 3.1.1 on 2020-10-05 19:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('role', models.CharField(choices=[('PH', 'Руководитель проекта'), ('IM', 'Интернет-маркетолог'), ('SS', 'SEO-специалист')], max_length=2, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('_type', models.CharField(choices=[('IS', 'Интернет-магазин'), ('CS', 'Корпоративный сайт')], max_length=2, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='WebPage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jandexid', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ProjectEmployeeConnection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project', to='projectapi.employee')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee', to='projectapi.project')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='webpage',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projectapi.webpage'),
        ),
    ]
