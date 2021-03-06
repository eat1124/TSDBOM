"""
Django settings for TSDBOM project.

Generated by 'django-admin startproject' using Django 1.9.7.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os
import djcelery

# SQLApi
sql_credit = {
    "host": "192.168.100.149\COMMVAULT",
    "user": "sa_cloud",
    "password": "1qaz@WSX",
    "database": "CommServ",
}

CVApi_credit = {
    "web_addr": "192.168.100.149",
    "port": "81",
    "username": "admin",
    "pass_wd": "Admin@2017",
    "token": "",
    "last_login": 0
}

djcelery.setup_loader()
# BROKER_URL = 'django://'
# CELERY_RESULT_BACKEND = 'djcelery.backends.database:DatabaseBackend'

BROKER_URL = 'redis://:tesunet@223.247.155.54:6379/0'
# CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/1'
# BROKER_URL = 'amqp://root:password@localhost:5672/myvhost'

CELERY_TIMEZONE = 'Asia/Shanghai'  # 时区
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERYBEAT_SCHEDULER = 'djcelery.schedulers.DatabaseScheduler'  # 定时任务

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '%6n))bx30e&#b+hd!074=4)d!+4w3l(+dy28&%fh&mzv)i@nvr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'dbom',
    'djcelery',
    'kombu.transport.django',
]

MIDDLEWARE_CLASSES = [
    # 'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # 'django.middleware.cache.FetchFromCacheMiddleware',
]

ROOT_URLCONF = 'TSDBOM.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(os.path.dirname(__file__), 'templates').replace('\\', '/'), ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

TEMPLATE_LOADERS = [
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
]

WSGI_APPLICATION = 'TSDBOM.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tsdbom',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': '192.168.100.154',
        'PORT': '3306',
    }
}

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
SITE_ROOT = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..')
STATIC_ROOT = os.path.join(SITE_ROOT, 'static')

EMAIL_HOST = 'smtp.exmail.qq.com'
EMAIL_HOST_USER = 'huangzx@tesunet.com.cn'
EMAIL_HOST_PASSWORD = 'China320701045'
EMAIL_PORT = 25

# CASHES_DIR = BASE_DIR + os.sep + "faconstor"+ os.sep + "static"+ os.sep + "mem"
# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
#         'LOCATION': CASHES_DIR,  # 设置缓存文件的目录
#         'OPTIONS': {
#             'MAX_ENTRIES': 300,  # 最大缓存个数（默认300）
#             'CULL_FREQUENCY': 3,  # 缓存到达最大个数之后，剔除缓存个数的比例，即：1/CULL_FREQUENCY（默认3）
#         },
#     }
# }


LOGIN_URL = '/login/'
