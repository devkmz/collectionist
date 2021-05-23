<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $element['info']->elementName }}</title>
</head>

<body>
    <table>
        <tr>
            <th>ID elementu</th>
            <th>Nazwa elementu</th>
            <th>Opis elementu</th>
            <th>Zdjęcie</th>
            @foreach($element['attributes'] ?? '' as $data)
                <th>{{ $data->attributeName }}</th>
            @endforeach
        </tr>
        <tr>
            <td>{{ $element['info']->id }}</td>
            <td>{{ $element['info']->elementName }}</td>
            <td>{{ $element['info']->elementDescription }}</td>
            <td><img src="<?php echo './storage/'.$element['info']->elementImage['name'];?>" width="250px"/></td>
            @foreach($element['attributes'] ?? '' as $data)
                <td>{{ $data->value }}</td>
            @endforeach
        </tr>
    <table>
</body>

</html>