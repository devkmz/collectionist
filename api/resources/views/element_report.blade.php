<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Element Report</title>
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

        .element-info {
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
            font-size: 10px;
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
    <div class="element-info">
        <h1>{{ $element['info']->elementName }}</h1>
        <p>{{ $element['info']->elementDescription }}</p>
        <p> Element pochodzi z kolekcji {{ $element['from_collection']->name }} </p>
        @if($element['info']->elementImage)
            <p><img src="<?php echo './storage/'.$element['info']->elementImage['name'];?>" width="80%"/></p>
        @endif
    </div>
    <table>
    @foreach($element['attributes'] ?? '' as $data)
    <tr>
        <th><h1>{{ $data->attributeName }}</h1></th>
        <td><p>{{ $data->value }}</p></td>
    </tr>
    @endforeach
    </table>
</body>

</html>