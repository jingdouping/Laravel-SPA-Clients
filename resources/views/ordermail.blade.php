<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}

        <title>Laravel Mail</title>
        @viteReactRefresh
        @vite('resources/js/ordermail.jsx')
    </head>
    <body>
        <div id="ordermail" data-orderitem='{{ $orderitem }}' data-username='{{ $username }}'>
            <p>{{ $username }} 様 ご注文ありがとうございます。</p><br/>

        </div>
    </body>
</html>
