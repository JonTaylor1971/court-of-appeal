# Generated by Django 4.0.1 on 2022-01-07 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='account_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='client_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='address',
            field=models.CharField(max_length=300, null=True),
        ),
    ]
