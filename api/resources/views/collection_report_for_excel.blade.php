<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $collection['info']->name }}</title>
</head>

<body>
    <table>
        <tr>
            @if(count($collection['elements']))
                <th>L.p.</th>
                <th>Nazwa elementu</th>
                <th>Opis elementu</th>
                <th>Zdjęcie elementu</th>
                    @foreach($collection['elements'][0]->elementsAttributes as $attribute)
                        <th>{{ $attribute['attributeName']}} </th>
                    @endforeach
            @else 
                <td>Brak elementów w kolekcji</td>
            @endif
        </tr>
        {{ $i = 1 }}
        @foreach($collection['elements'] ?? '' as $data)
        <tr>
            <td>{{ $i++ }}</td>
            <td>{{ $data->elementName }}</td>
            <td>{{ $data->elementDescription }}</td>
            @if($data->elementImage)
                <td><img src="<?php echo './storage/'.$data->elementImage['name'];?>" width="250px"/></td>
            @else
                <td></td>
            @endif
            @foreach($data->elementsAttributes as $attribute)
                <td>{{ $attribute['value']}} </td>
            @endforeach
        </tr>
        @endforeach
    </table>
</body>

</html>