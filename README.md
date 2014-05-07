Buffer
===========

A javascript Mootools plugin for image buffering

How to use
----------

Syntax :

    var buffer = new Buffer({
        debug: false, // console logging (if a file fails loading)
        cache: false, // force uncaching by adding time after filename
        path: '/'     // path to use for image loading
    });

Get all images of a type, or one image in particular

    buffer.get(type[, key])

Set one or more images if src is an array.
Loading occurs only if the image is not already loaded and returns it.
If you are using multiple times an image with distinct behaviour, don't forget to use image.clone().
If args is set, args is passed to the callback function

    buffer.set(type, src, fn[, args])

Defines the path to use to load images

    buffer.path(path)

Removes all images of a type, or a single image

    buffer.remove(type[, key])
