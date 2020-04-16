<?php

return [
    'caption' => 'Настройки сайта',
    'introtext' => 'Основные пользовательские настройки сайта',
    'settings' => [
        'rss' => [
            'caption' => 'Документ RSS ленты',
            'type'  => 'dropdown',
			'elements'=>"@SELECT pagetitle,id FROM [+PREFIX+]site_content WHERE contentType='text/xml' OR contentType='application/rss+xml'"
        ],
    ],
];
