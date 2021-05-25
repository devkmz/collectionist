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
        @if(count($collection['elements']))
            <tr>
                <th>L.p.</th>
                <th>Nazwa elementu</th>
                <th>Opis elementu</th>
                <th>Zdjęcie elementu</th>
                    @foreach($collection['elements'][0]->elementsAttributes as $attribute)
                        <th>{{ $attribute['attributeName']}} </th>
                    @endforeach
                <th>Należy do kolekcji</th>
                <th>Opis kolekcji</th>
            </tr>
        @else
            <tr>
                <td>Nazwa kolekcji</td>
                <td>Opis kolekcji</td>
                <td>Status</td>
            </tr>
            <tr>
                <td>{{ $collection['info']->name }} </td>
                <td> {{ $collection['info']->description }} </td>
                <td>Brak elementów w kolekcji</td>
            </tr>
        @endif
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
            <td>{{ $collection['info']->name }} </td>
            <td> {{ $collection['info']->description }} </td>
        </tr>
        @endforeach
    </table>
</body>

</html>