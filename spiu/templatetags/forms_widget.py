from django.template import Library

register = Library()


@register.filter
def add_classes(widget, classes):
    widget.field.widget.attrs['class'] = classes
    return widget


@register.filter
def add_placeholder(widget, placeholder):
    widget.field.widget.attrs['placeholder'] = placeholder
    return widget


@register.filter
def add_key_value_attr(widget, key_value):
    attr, value = key_value.split(',')
    widget.field.widget.attrs[attr] = value
    if widget.widget_type == 'relatedfieldwidgetwrapper':
        widget.field.widget.widget.attrs[attr] = value
    return widget


"""
{% load form_widgets %}

<form class="form" method="post" action="">
    {{ form.name.label_tag }}
    {{ form.name|add_classes:"span4"|add_placeholder:"Your Name" }}

    {{ form.email.label_tag }}
    {{ form.email|add_classes:"span4"|add_placeholder:"email@example.com" }}

    {{ form.message.label_tag }}
    {{ form.message|add_classes:"span4"|add_placeholder:"Your message..."|add_key_value_attr:"rows,3" }}

    <button type="submit" class="btn btn-primary">Send</button>
</form>

"""
