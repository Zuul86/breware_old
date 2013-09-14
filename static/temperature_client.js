var breware = breware || {};

(function(ns, $){

    $(function () {
        var sec = 0;
        var data = [new Array(1)];

        var showMinutes = function (format, val) {
            return Math.round((val / 60)*10)/10;
        };

        var plot1 = $.jqplot('mashrest', [[0]], {
            title: 'Mash Rest',
            series: [
                {
                    showMarker: false,
                    lineWidth: 2.2,
                    color: '#0571B6',
                    fillAndStroke: false
                }
            ],
            axes: {
                xaxis: {
                    min: 0,
                    max: 6000,
                    numberTicks: 11,
                    tickOptions:{
                        formatter: showMinutes
                    },
                    pad: 0
                },
                yaxis: {
                    min: 50,
                    max: 160,
                    tickOptions: {
                        formatString: '%.1f'
                    },
                    numberTicks: 12,
                    pad: 0
                }
            },
            cursor: {
                zoom: false,
                showTooltip: false,
                show: false
            },
            highlighter: {
                useAxesFormatters: false,
                showMarker: false,
                show: false
            },
            grid: {
                gridLineColor: '#DDDDDD',
                borderWidth: 2,
                shadow: true
            }
        });

        window.onresize = function(event) {
            plot1.replot();
        };

        function addTemp(temp) {
            data.push([sec++, parseFloat(temp)]);
            $("#currentTemperature").text(temp);
            plot1.series[0].data = data;
            plot1.replot();
        }

        var ws = window.WebSocket || window.MozWebSocket;

        ws = new WebSocket('ws://' + location.host + '/temperaturesocket');

        ws.onmessage = function (evt) {
            var messageObject = JSON.parse(evt.data);
            if (messageObject.Message == 'StateChanged')
                if (messageObject.Payload.State == 'True')
                    $('#flame').prop('checked', true);
                else
                    $('#flame').prop('checked', false);
                    
            if (messageObject.Message == 'CurrentTemperature')
                addTemp(messageObject.Payload.Temperature);   
        };

        $('#start_temperature_reading').on('click', function () {
            ws.send('{"message":"start"}');
        });

        $('#close_socket').on('click', function () {
            ws.send('{"message":"stop"}');
        });
        
        $('#add_step').on('click', function() {
            var stepTemp = $('#stepTemperature').val();
            var stepDuration = $('#stepDuration').val();
            var message = '{"message":"addSteps", "payload":{"Temperature":' + stepTemp + ',"Duration":' + stepDuration + '}}';

            ws.send(message);
        });

        $('#flame').change(function () {
            var state = $('#flame').prop('checked');
            var message = '{"message":"flame", "payload":"' + state + '"}';
            ws.send(message);

        })
    });


})(breware, jQuery)