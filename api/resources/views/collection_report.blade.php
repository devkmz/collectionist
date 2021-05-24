<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Collection Report</title>
    <style type="text/css">
        *,
        ::after,
        ::before {
            box-sizing: border-box;
        }

        body {
            font-family: "DejaVu Sans Mono", monospace;
            text-align: center;
            font-size: 14px;
            padding: 24px;
        }

        .collection-info {
            border-bottom: 1px solid #dfdfdf;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            line-height: 1.5;
            text-align: left;
        }

        table tr th {
            background: #fafafa;
            width: 40%;
        }

        table tr td {
            width: 60%;
        }

        table tr th,
        table tr td {
            padding: 16px;
            border: 1px solid #dfdfdf;
        }
    </style>
</head>

<body>
    <div class="collection-info">
        <p>Elementy pochodzą z kolekcji</p>
        <h3>{{ $collection['info']->name }}</h3>
        <p>{{ $collection['info']->description }}</p>
    </div>

    @foreach($collection['elements'] ?? '' as $data)
        <h1>{{ $data->elementName }}</h1>
        <p>{{ $data->elementDescription }}</p>
        @if($data->elementImage)
            <p><img src="<?php echo './storage/'.$data->elementImage['name'];?>" width="250" height="150"/></p>
        @endif
        <h3>Szczegółowe informacje</h3>
        <table>
            @foreach($data->elementsAttributes as $attribute)
            <tr>
                <th>{{ $attribute['attributeName']}} </th>
                <td>{{ $attribute['value']}} </td>
            </tr>
            @endforeach
        </table>
        <br/>
    @endforeach
</body>

</html>