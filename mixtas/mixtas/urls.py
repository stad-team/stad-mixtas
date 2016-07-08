from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^menu/', include('mixtas.menu.urls')),
    url(r'^pedidos/', include('mixtas.pedidos.urls')),
    url(r'^usuarios/', include('mixtas.usuarios.urls')),
]
