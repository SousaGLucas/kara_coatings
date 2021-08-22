-- inserts to the table status

SET search_path TO kara_coatings;


INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'active'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'inactive'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'open'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'closed'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'canceled'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'received'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'pending'
    , 1
);

INSER INTO
    status (
        description
        , create_user
    )
VALUES (
    'paidout'
    , 1
);