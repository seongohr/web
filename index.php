<?php
    $street = $_GET["street"];
    $city = $_GET["city"];
    $state = $_GET["state"];
    $lat = $_GET["lat"];
    $lon = $_GET["lon"];
    $detailUrl = $_GET["detailUrl"];
    $page = $_GET["page"];
    $curr_loc = $_GET["curr_loc"];
    $timeOffset = $_GET["timeOffset"];
    $curr_city = $_GET["curr_city"];
    $forecast = null;
    $curr_loc_checked = "";

    if ($curr_loc == "true") {
        $curr_loc_checked = "checked";
    }

    $state_list_keys = ["State", "N/A", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
    $state_list_values = ["State", "------------------------", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

    $state_list = [];
    for ($i=0; $i < count($state_list_keys); $i++) {
        $k = $state_list_keys[$i];
        $v = $state_list_values[$i];
        $state_list[$k] = $v;
    }
    // var_dump($state_list);
    

    function debug_to_console($data) {
        $output = $data;
        if (is_array($output)) {
            $output = implode(',', $output);
        }
    }

    function getWeather($lat, $lon) {
        $url = "https://api.forecast.io/forecast/10d7cb18d4b85ab9db2fa9593b5e35d2/$lat,$lon?exclude=minutely,hourly,alerts,flags";
        $weatherData = file_get_contents($url);
        $forecast = json_decode($weatherData);
        debug_to_console($forecast->daily);
        
        return $forecast;
    }

    function getDailyDetail($url,$dailyDetail) {
        $dailyDetail = file_get_contents($url);
        $dailyDetail = json_decode($dailyDetail);
        return $dailyDetail;
    }

    function getGeo($lat, $lon, $street, $city, $state) {
        $url = "https://maps.googleapis.com/maps/api/geocode/xml?address='.$street.','.$city.',+'.$state.'&key=AIzaSyALy-evwcpb12Fn6zv9Z1d1O7y4YcU9mM8";
        // $location = simplexml_load_file($url) or die("<div class=\"error_box\" id=\"error_box\">Please check the input address.</div>");
        $geoCode;
        if (simplexml_load_file($url)){
            $location = simplexml_load_file($url);
            if ($location->status == "OK") {
                $lat = (string)$location->result->geometry->location->lat;
                $lon = (string)$location->result->geometry->location->lng;
                $geoCode["lat"] = $lat;
                $geoCode["lon"] = $lon;
                $geoCode["success"] = true;
            }
            else {
                $geoCode["success"] = false;
            }
        }
        else {
            $geoCode["success"] = false;
        }
        return $geoCode;
    }

    function getImage($status) {
        $images = array(
            "clear-day" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-12-512.png\" height=\"40px\" width=\"40px\">",
            "clear-night" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-12-512.png\" height=\"40px\" width=\"40px\">",
            "rain" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-04-512.png\" height=\"40px\" width=\"40px\">",
            "snow" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-19-512.png\" height=\"40px\" width=\"40px\">",
            "sleet" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-07-512.png\" height=\"40px\" width=\"40px\">",
            "wind" => "<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png\" height=\"40px\" width=\"40px\">",
            "fog" =>"<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png\" height=\"40px\" width=\"40px\">",
            "cloudy" =>"<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-01-512.png\" height=\"40px\" width=\"40px\">",
            "partly-cloudy-day"=>"<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-02-512.png\" height=\"40px\" width=\"40px\">",
            "partly-cloudy-night"=>"<img src=\"https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-02-512.png\" height=\"40px\" width=\"40px\">"
        );
        return $images[$status];
    }

    function getDetailImage($icon) {
        $icons = array(
            "clear-day" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png\">",
            "clear-night" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png\">",
            "rain" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png\">",
            "snow" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png\">",
            "sleet" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png\">",
            "wind" => "<img src=\"https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png\">",
            "fog" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png\">",
            "cloudy" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png\">",
            "partly-cloudy-day" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png\">",
            "partly-cloudy-night" => "<img src=\"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png\">"
        );
        return $icons["$icon"];
    }

    function getCity($timezone) {
        if (empty($_GET["city"])){
            $city = explode("/",$timezone);
            $city = $city[1];
            $city = str_replace("_"," ",$city);
        }
        else {
            $city = $_GET["city"];
        }
        return $city;
    }

    function getChartDataStr($hourlyData, $chartDataStr){
        foreach ($hourlyData as $key => $value) {
            $chartDataStr = $chartDataStr
            ."["
            .$key
            .","
            .round($value->temperature, 0)
            ."],";
        }
        $charDataStr = substr_replace($chartDataStr,"",-1);
        return $chartDataStr;
    }

    function getTime($time, $timeOffset, $diff) {
        $server_time = date("g",(int)$time);
        // echo"101010".$server_time;
        $user_time = ($server_time-($timeOffset / 60)+$diff)%12;
        if ($user_time < 0) {
            $user_time = $user_time + 12;
        }
        return $user_time;
    }

    function getTimeOffset($diff, $timezone, $timeOffset) {
        $user_tz = new DateTimeZone($timezone);
        $user = new DateTime('now', $user_tz);
        $user_offset = $user->getOffset();
        $user_offset = $user->getOffset();
        $local_offset = -$timeOffset;

        $diff = ($user_offset / 60) - $local_offset;
        $diff_hours = $diff / 60;

        return $diff_hours;
    }

    function getPrecipitationStatus($value) {
        if ($value <= 0.001) {
            return "N/A";
        }
        elseif ($value <= 0.015) {
            return "Very Lignt";
        }
        elseif ($value <= 0.05) {
            return "Lignt";
        }
        elseif ($value <= 0.1) {
            return "Moderate";
        }
        elseif ($value > 0.1) {
            return "Heavy";
        }
    }
?>

<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <style>
            body {
                text-align: center;
            }

            .weather_container {
                height: 200px;
                width: 700px;
                background-color: #32ab39;
                padding: 10px 50px 20px 50px;
                display: inline-block;
                border-radius: 15px;
            }

            .weather_title {
                text-align: center;
                font-size: 50px;
                margin: 0 0 5px 0;
                color: white;
                display: inline-block;
                font-weight: lighter;
            }

            #input_container {
                height: 120px;
                display: flex;
                width:100%;
            }

            #address_container {
                width: 55%;
                display: inline-block;
                height: 100%;
                text-align: left;
            }
            
            #street_container {
                top: 0;
                font-size: 20px;
                font-weight: bold;
                color: white;
                display: inline-block;
            }

            #street_text{
                margin-right: 10px;
            }
            
            #city_container {
                font-size: 20px;
                font-weight: bold;
                color: white;
                display: inline-block;
            }

            #city_text {
                margin-right: 24px;
            }

            #state_container {
                font-size: 20px;
                font-weight: bold;
                color: white;
                display: inline-block;
            }
            #current_location_box {
                text-align: right;
                display: inline-block;
                height: 95%;
                width: 45%;
                border-left: 5px solid white;
            }

            #checkbox_container {
                font-size: 20px;
                font-weight: bold;
                color: white;
                display: inline-block;
            }

            #buttons_container {
                text-align: left;
                margin-left: 0px;
                padding-left: 35%;
            }

            #error_box{
                display: inline-block;
                margin-top: 25px;
            }

            .error_message {
                width: 400px; 
                font-size: 20px; 
                color: black; 
                background-color: lightgrey; 
                border: solid 2px grey;
                display: inline-block;
            }

            #wrapper {
                display: flex;
                flex-wrap: wrap;
                vertical-align: middle;
                font-weight: bold;
                background-color: #5dc4f4; 
                height:350px; 
                width: 520px;
                border-radius: 15px;
                margin: 0 auto;
                color: white;
            }

            #curr_city{
                text-align: left;
                font-size: 40px;
                padding: 15px 10px 0px 25px;
                flex-basis: 100%;
            }

            #curr_timezone {
                text-align:left;
                padding-left: 25px;
                flex-basis: 100%;
            }

            #curr_temperature {
                text-align:left;
                padding: 0px 10px 0px 25px;
                font-size: 100px;
                align-self: flex-end;
            }

            #curr_temperature_f {
                padding: 5px 10px 0px 25px;
                font-size: 50px;
                align-self: flex-end;
                margin-bottom: 10px;
            }

            #curr_temperature_img {
                margin-top: 15px;
            }

            #curr_summary {
                text-align:left;
                padding: 0px 10px 0px 25px;
                font-size: 40px;
                flex-basis: 100%;
            }

            #summary_click {
                cursor: pointer;
            }

            #curr_humidity {
                flex-grow:1;
                text-align: center;
                font-size: 20px;
                padding-bottom: 15px;
            }

            #curr_pressure {
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }

            #curr_windSpeed{
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }

            #curr_cloudCover {
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }

            #curr_visibility {
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }

            #curr_ozone {
                flex-grow: 1;
                text-align: center;
                font-size: 20px;
            }

            #table_wrapper {
                display: inline-block;
                margin: 0 auto;
                margin-top: 40px;
                font-weight: bold;
            }

            #currTable {
                text-align: center;
                width: 850px;
                background-color: #9fc9ee;
                border: solid 2px deepskyblue;
                border-collapse: collapse;
                color: white;
            }

            #currTable > tbody> tr> th, 
            #currTable > tbody> tr > td {
                border: solid 2px #75b2d9;
            }

            #detail_wrapper {
                margin: 0 auto;
                height: 400px;
                width: 500px;
                border-radius: 15px;
                background-color: #a7d0d9;
                vertical-align: middle;
                color: white;
            }

            #detail_title {
                margin: 10px auto 20px auto;
                color: black;
                font-size: 35px;
                font-weight: bold;
            }

            #flex_container {
                display:flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }

            #flex_halfTop {
                display:flex;
                flex-wrap:wrap;
                flex-direction: column;
                height: 57%;
            }

            #left_box {
                margin-left: 30px;
                width: 270px;
                height: 216px;
                position: relative;
            }

            #detail_summary {
                text-align: left;
                font-size: 30px;
                position: absolute;
                bottom: 120px;
            }

            #detail_summary > span {
                left: 0px;
                bottom: 0px;
                vertical-align: bottom;
                font-weight: bold;
            }

            #detail_temperature_wrapper {
                text-align: left;
                font-weight: bold;
                position: absolute;
                bottom: 0;
            }

            #detail_temperature {
                font-size: 109px;
            }

            #detail_temperature_degree {
                vertical-align: top;
            }

            #detail_temperature_f {
                font-size: 75px;
            }

            #detail_icon > img {
                width: 200px;
                height: 200px;
            }

            #flex_halfBottom {
                display:flex;
                flex-wrap: wrap;
                padding-bottom:10px;
            }

            #detail_indicators {
                flex-basis: 60%;
                text-align : right;
                font-size: 20px;
                padding-top: 3px;
            }

            #detail_indicators_values {
                text-align: left;
                font-size: 25px;
                padding-left: 8px;
            }

            #detail_units {
                font-size: 15px;
                padding-left: 2px;
                font-weight: bold;
            }

            #arrow_buttons{
                margin: 0 auto;
                height: 50px;
                width: 50px;
            }

            #arrow_down {
                margin: 0 auto;
                height: 50px;
                width: 50px;
                cursor: pointer;
            }

            #arrow_up {
                display: none;
                height: 50px;
                width: 50px;
                cursor: pointer;
            } 

            h1 {
                color: black;
            }

            #chart {
                margin: 0 auto;
                height: 200px;
                width: 800px;
                visibility: hidden;
            }
        </style>
    </head>
    <body onload="selectCurrLoc()">
        <form 
            id="myForm" 
            method="GET" 
            action="<?=$_SERVER['PHP_SELF'];?>"
        >
            <div class="weather_container">
                <h1 class="weather_title">
                    <i>Weather Search</i>
                </h1>
                <div id="input_container">
                    <div id="address_container">
                        <div id="street_container">
                            <span id="street_text">Street</span>
                            <input 
                                type="text" 
                                name="street" 
                                id="street" 
                                value="<?=$street;?>">
                        </div><br>    
                        <div id="city_container">
                            <span id="city_text">City</span>
                            <input 
                                type="text" 
                                name="city" 
                                id="city" 
                                value="<?=$city;?>">
                        </div><br>
                        <div id="state_container">State 
                            <select name="state" id="state">
                                <?php
                                    foreach ($state_list as $key => $value) {
                                ?>
                                    <option 
                                        <?=$key=="N/A"?"disabled":"";?>
                                        <?=$key==$state?"selected":"";?> 
                                        value="<?=$key;?>">
                                        <?=$value?>
                                    </option>
                                <?php
                                    }
                                ?>
                            </select>
                        </div>
                    </div>
                    <div id="current_location_box">
                        <div id="checkbox_container">
                            <input 
                                type="checkbox"     
                                name="curr_loc" 
                                id="curr_loc" 
                                onclick="selectCurrLoc()"
                                value="true" 
                                <?=$curr_loc_checked;?>
                            /> 
                            <span>Current Location</span>
                        </div>
                    </div>
                </div>
                <div id="buttons_container">
                    <input 
                        type="submit" 
                        name="form_submit" 
                        value="search" 
                        onclick="return submitForm()"
                    />
                    <input 
                        type="button" 
                        value="clear" 
                        onclick="clearForms()"
                    />
                </div>
            </div>
            <input type="hidden" name="lat" id="lat">
            <input type="hidden" name="lon" id="lon">
            <input type="hidden" name="page" id="page">
            <input type="hidden" name="detailUrl" id="detailUrl">
            <input type = "hidden" name="curr_city" id="curr_city">
            <input type="hidden" name="timeOffset" id="timeOffset">
        </form>    
        <div class="error_box" id="error_box"></div><br>

    <!-- php script -->        
    <?php
        if ($page === "current") {
            $geoCode;
            if ($curr_loc == "true") {
                $curr_loc_checked = "checked";
                $forecast = getWeather($lat, $lon);
            } else {
                $_street = urlencode($street);
                $_city = urlencode($city);
                $_state = urlencode($state);
                $geoCode = getGeo($lat, $lon, $_street, $_city, $_state);             

                if ($geoCode["success"] === false) {
                    echo "<div class=\"error_message\">Please check the input address.</div>";
                }
                else {
                    $forecast = getWeather($geoCode["lat"], $geoCode["lon"]);
                }
            }
            if ($curr_loc == "true" || $geoCode["success"] === true) {
                //extract current weather information
                $lat = $forecast->latitude;
                $lon = $forecast->longitude;
                $timezone = $forecast->timezone;
                $current = $forecast->currently;
                $summary = $current->summary;
                $temperature = round($current->temperature,0);
                $humidity = round($current->humidity,2);
                $pressure = round($current->pressure,2);
                $windSpeed = round($current->windSpeed,2);
                $cloudCover = round($current->cloudCover,3);
                $visibility = round($current->visibility,2);
                $ozone = round($current->ozone,2);
                // $city = getCity($timezone);
                $_city = $curr_city? $curr_city: $city;
    ?>

                <div id="wrapper">
                    <div id="curr_city">
                        <?=$_city;?>
                    </div>
                    <div id="curr_timezone">
                        <?=$timezone;?>
                    </div>
                    <div id="curr_temperature">
                        <?=$temperature;?>
                    </div>
                    <div id="curr_temperature_img">
                        <img src="https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png" 
                        height="15px" width="15px">
                    </div>
                    <div id="curr_temperature_f">F
                    </div>
                    <div id="curr_summary">
                        <?=$summary;?>
                    </div>
                    <div id="curr_humidity" title="humidity">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-16-512.png" 
                        height="30px" width="30px"><br><?=$humidity;?>
                    </div>
                    <div id="curr_pressure" title="pressure">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-25-512.png" 
                        height="30px" width="30px"><br><?=$pressure;?>
                    </div>
                    <div id="curr_windSpeed" title="windSpeed">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-27-512.png" 
                        height="30px" width="30px"><br><?=$windSpeed;?>
                    </div>
                    <div id="curr_visibility" title="visibility">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-30-512.png" 
                        height="30px" width="30px"><br><?=$visibility;?></div>
                    <div id="curr_cloudCover" title="cloudCover">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-28-512.png" 
                        height="30px" width="30px"><br><?=$cloudCover;?></div>
                    <div id="curr_ozone" title="ozone">
                        <img src="https://cdn2.iconfinder.com/data/icons/weather-74/24/weather-24-512.png" 
                        height="30px" width="30px"><br><?=$ozone;?></div>
                </div>

                <!-- daily weather table -->
                <div id="table_wrapper">
                    <table id="currTable">
                        <th>Date</th>
                        <th>Status</th>
                        <th>Summary</th>
                        <th>TemperatureHigh</th>
                        <th>TemperatureLow</th>
                        <th>Wind Speed</th>
    <?php
                foreach ($forecast->daily->data as $daily) {
                    $icon = getImage($daily->icon);

                    $table_time = $daily->time;
                    $_table_time = date("Y\-m\-d", $table_time);
                    $table_summary = $daily->summary;
                    // $dailyDetailUrl = "https://api.darksky.net/forecast/10d7cb18d4b85ab9db2fa9593b5e35d2/$lat,$lon,$daily->time?exclude=minutely";
                    $dailyDetailUrl = "https://api.darksky.net/forecast/10d7cb18d4b85ab9db2fa9593b5e35d2/$lat,$lon,$table_time?exclude=minutely";
    ?>
                        <tr>
                            <td><?=$_table_time?></td>
                            <td><?=$icon?></td>
                            <td><span id="summary_click" onclick="clickSummary('<?=$dailyDetailUrl;?>')"><?=$table_summary;?></span></td>
                            <td><?=round($daily->temperatureHigh,2);?></td>                                  
                            <td><?=round($daily->temperatureLow,2);?></td>
                            <td><?=round($daily->windSpeed,2);?></td>
                        </tr>
    <?php
                }
            }
    ?>
                </table>
            </div>
    <?php
        }
        else if ($page === "dailyDetail") {
            $dailyDetail = getDailyDetail($detailUrl, $dailyDetail);
            $timezone = $dailyDetail->timezone;
            $currently = $dailyDetail->currently;
            $data = $dailyDetail->daily->data;
            $summary = $currently->summary;
            $temperature = round($currently->temperature, 0);
            $icon = $currently->icon;
            $icon = getDetailImage($icon);
            $precipitation = $currently->precipIntensity;
            $_precipitation = getPrecipitationStatus($precipitation);
            $rain = $currently->precipProbability;
            $_rain = round(100 * $rain, 0);
            $windSpeed = round($currently->windSpeed, 2);
            $humidity = $currently->humidity;
            $_humidity = round(100 * $humidity, 0);
            $visibility = round($currently->visibility, 3);

            //time conversion
            $hourlyData = $dailyDetail->hourly->data;
            $chartDataStr = "";
            $hourlyDataLength = count($hourlyData);
            $time_diff = getTimeOffset($diff, $timezone, $timeOffset);
            $chartDataStr = getChartDataStr($hourlyData, $chartDataStr);

            $sunrise = $data[0]->sunriseTime;
            $_sunrise = getTime($sunrise, $timeOffset, $time_diff);
            $sunset = $data[0]->sunsetTime;
            $_sunset = getTime($sunset, $timeOffset, $time_diff);
    ?>
            <div id="detail_title">Daily Weather Detail</div><br>
            <div id="detail_wrapper">
                <div id="flex_container">
                    <div id="flex_halfTop">
                        <div id="left_box">
                        <div id="detail_summary">
                            <span>
                                <?=$summary;?>
                            </span>
                        </div>
                        <div id="detail_temperature_wrapper">
                            <span id="detail_temperature">
                                <?=$temperature;?>
                            </span>
                            <span id="detail_temperature_degree">
                                <img src="https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png" height="13px" weight="13px">
                            </span>
                            <span id="detail_temperature_f">F
                            </span>
                        </div>
                    </div>
                        <div id="detail_icon"><?=$icon;?></div>
                    </div>
                    <div id="flex_halfBottom">
                        <div id="detail_indicators">Precipitation:</div>
                        <div id="detail_indicators_values"><?=$_precipitation;?></div>
                        <div id="detail_indicators">Chance of Rain:</div>
                        <div id="detail_indicators_values"><?=$_rain;?><span id="detail_units">%</span></div>
                        <div id="detail_indicators">Wind Speed:</div>
                        <div id="detail_indicators_values"><?=$windSpeed;?><span id="detail_units">mph</span></div>
                        <div id="detail_indicators">Humidity:</div>
                        <div id="detail_indicators_values"><?=$_humidity;?><span id="detail_units">%</span></div>
                        <div id="detail_indicators">Visibility:</div>
                        <div id="detail_indicators_values"><?=$visibility;?><span id="detail_units">mi</span></div>
                        <div id="detail_indicators">Sunrize/Sunset:</div>
                        <div id="detail_indicators_values">
                            <?=$_sunrise;?>
                            <span id="detail_units">AM/
                            </span>
                            <?=$_sunset;?>
                            <span id="detail_units">PM</span>
                        </div>
                    </div>
                </div>
            </div><br>
            <div id="detail_chart">
                <h1>Day's Hourly Weather</h1>
                <div id="arrow_buttons">
                    <img
                        id="arrow_up"
                        onclick="clickArrow(false)"
                        src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ExpandLess-512.png"
                    >
                    <img
                        id="arrow_down"
                        onclick="clickArrow(true)"
                        src="https://cdn4.iconfinder.com/data/icons/geosm-e-commerce/18/point-down-512.png"
                    >
                </div>
                <br>
                <div id="chart"></div>
            </div>
            <script>    
                google.charts.load('current', {packages: ['corechart', 'line']});
                google.charts.setOnLoadCallback(drawCrosshairs);
            
            function drawCrosshairs() {
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'X');
                data.addColumn('number', 'T');
        
                data.addRows([
                <?=$chartDataStr;?>
                ]);
        
                var options = {
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'Temperature'
                },
                colors: ['skyblue'],
                };
        
                var chart = new google.visualization.LineChart(document.getElementById('chart'));
        
                chart.draw(data, options);
                // chart.setSelection([{row: 38, column: 1}]);
                }
            </script>
    <?php
        }
    ?>

        
    <script>
        function validateForms() {
            var city = document.getElementById('city').value;
            var street = document.getElementById('street').value;
            var state = document.getElementById('state').value;
            
            if (street === "" || city === "" || state === "State") {
                return false;
            }
            return true;
        }
        function clearWeatherDiv() {
            document.getElementById('error_box').innerHTML = "";
            document.getElementById('error_box').style.visibility = "hidden";
        }

        function clearForms() {
            document.getElementById('street').value = "";
            document.getElementById('city').value = "";
            document.getElementById('state').selectedIndex = 0;
            // document.getElementById('myForm').reset();
            document.getElementById("curr_loc").checked = false;
            document.getElementById("page").innerHTML = "";
            selectCurrLoc();

            var form = document.getElementById("myForm");
            form.submit();
        }

        function clearFormsCurrLoc() {
            document.getElementById('street').value = "";
            document.getElementById('city').value = "";
            document.getElementById('state').selectedIndex = 0;
        }

        function selectCurrLoc(){
            if (document.getElementById('curr_loc').checked == true) {
                document.getElementById('street').disabled = true;
                document.getElementById('city').disabled = true;
                document.getElementById('state').disabled = true;
                clearFormsCurrLoc();
            }
            else {
                document.getElementById('street').disabled= false;
                document.getElementById('city').disabled = false;
                document.getElementById('state').disabled = false;
            }
        }

        function printErrorMessage() {
            var elem = document.getElementById('error_box');
            elem.display = "block";
            elem.setAttribute("class", "error_message");
            elem.innerHTML = "Please check the input address.";

            var page = "<?php echo $page ?>";
                if (page == "current") {
                    var element1 = document.getElementById("wrapper");
                    var element2 = document.getElementById("table_wrapper");
                    element1.style.visibility = "hidden";
                    element2.style.visibility = "hidden";
                    removeElement(element2);
                }
                    
                else if (page == "dailyDetail") {
                    var element1 = document.getElementById("detail_title");
                    var element2 = document.getElementById("detail_wrapper");
                    var element3 = document.getElementById("detail_chart");
                    element1.style.visibility = "hidden";
                    element2.style.visibility = "hidden";
                    element3.style.visibility = "hidden";
                    // removeElement(element2);
                    // removeElement(element3);
                }
        }

        function clickSummary(url) {
            console.log('clickSummary(): url:', url);
            document.getElementById('page').value = "dailyDetail";
            document.getElementById('detailUrl').value = url;
            
            var t = new Date();
            var tOffset = t.getTimezoneOffset();
            document.getElementById('timeOffset').value = tOffset;
            
            document.getElementById('myForm').submit();
        }

        function removeElement(elem) {
            while (elem.firstChild) {
                elem.firstChild.remove();
            }
        }

        function clickArrow(open) {
            var chart = document.getElementById("chart");
            var arrow_up = document.getElementById("arrow_up");
            var arrow_down = document.getElementById("arrow_down");

            if (open) {
                chart.style.visibility = "visible";
                arrow_up.style.display = "block";
                arrow_down.style.display = "none";
            }
            else {
                chart.style.visibility = "hidden";
                arrow_up.style.display = "none";
                arrow_down.style.display = "block";
            }
        }

        function submitForm() {
            //current location mode
            if (document.getElementById('curr_loc').checked == true) {
                var curr = new XMLHttpRequest();
                curr.open("GET", 'http://ip-api.com/json', false);
                curr.send();
                var currLoc = JSON.parse(curr.responseText);
                document.getElementById('lat').value = currLoc.lat;
                document.getElementById('lon').value = currLoc.lon;
                document.getElementById('curr_city').value = currLoc.city;
            } else {
                //invalid input
                if (validateForms() === false) {
                    printErrorMessage();
                    return false;
                }
                //valid input
                else {
                    console.log('address');
                }
            }
            //time offset(server vs client)
            var t = new Date();
            var timeOffset = t.getTimezoneOffset();
            document.getElementById("timeOffset").value = timeOffset;
            document.getElementById("page").value = "current";
            const form = document.getElementById("myForm");
            form.submit();
        }
    </script>
    </body>
</html>

