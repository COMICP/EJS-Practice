INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
UPDATE public.account
SET account_type = 'Admin'
where account_firstname = 'Tony';
DELETE FROM public.account
WHERE account_firstname = 'Tony';
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_model = 'Hummer';
select inv_make,
    inv_model,
    inventory.classification_id
from inventory
    inner join classification on inventory.classification_id = classification.classification_id
where classification_name = 'Sport';
UPDATE public.inventory
SET inv_thumbnail = REPLACE(
        inv_thumbnail,
        '/images',
        '/images/vehicles'
    ),
    inv_image = REPLACE(
        inv_image,
        '/images',
        '/images/vehicles'
    );