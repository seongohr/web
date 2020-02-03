package com.example.weatherapp;


import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;


/**
 * A simple {@link Fragment} subclass.
 */
public class FavFragment extends Fragment {
    ImageView card1_image;
    TextView card1_temp;
    TextView card1_summary;
    TextView card1_city;

    TextView card2_humidity;
    TextView card2_windSpeed;
    TextView card2_visibility;
    TextView card2_pressure;

    TextView table_date1;
    TextView table_date2;
    TextView table_date3;
    TextView table_date4;
    TextView table_date5;
    TextView table_date6;
    TextView table_date7;
    TextView table_date8;

    ImageView table_image1;
    ImageView table_image2;
    ImageView table_image3;
    ImageView table_image4;
    ImageView table_image5;
    ImageView table_image6;
    ImageView table_image7;
    ImageView table_image8;

    TextView table_minTemp1;
    TextView table_minTemp2;
    TextView table_minTemp3;
    TextView table_minTemp4;
    TextView table_minTemp5;
    TextView table_minTemp6;
    TextView table_minTemp7;
    TextView table_minTemp8;

    TextView table_maxTemp1;
    TextView table_maxTemp2;
    TextView table_maxTemp3;
    TextView table_maxTemp4;
    TextView table_maxTemp5;
    TextView table_maxTemp6;
    TextView table_maxTemp7;
    TextView table_maxTemp8;

    String city;
    String forecastData;

    public FavFragment() {
        // Required empty public constructor
    }

    public static FavFragment newInstance(int position, String forecastData,
                                                  String city) {
        FavFragment summaryFragment = new FavFragment();
        position = position + 1;
        Bundle bundle = new Bundle();
        bundle.putString("position", ""+ position);
        bundle.putString("forecastData", forecastData);
        bundle.putString("city", city);
        summaryFragment.setArguments(bundle);
        return summaryFragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_main_summary, container, false);
        CardView cardView1 = view.findViewById(R.id.card1);
        cardView1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(FavFragment.this.getActivity(), Detail.class);
                intent.putExtra("city", city);
                intent.putExtra("forecastData", forecastData);

                startActivity(intent);
            }
        });

        card1_image = view.findViewById(R.id.card1_image);
        card1_temp = view.findViewById(R.id.card1_temperature);
        card1_summary = view.findViewById(R.id.card1_summary);
        card1_city = view.findViewById(R.id.card1_city);

        card2_humidity = view.findViewById(R.id.card2_humidity_txt1);
        card2_windSpeed = view.findViewById(R.id.card2_windSpeed_txt1);
        card2_visibility = view.findViewById(R.id.card2_Visibility_txt1);
        card2_pressure = view.findViewById(R.id.card2_pressure_txt1);


        table_date1 = view.findViewById(R.id.table_date1);
        table_date2 = view.findViewById(R.id.table_date2);
        table_date3 = view.findViewById(R.id.table_date3);
        table_date4 = view.findViewById(R.id.table_date4);
        table_date5 = view.findViewById(R.id.table_date5);
        table_date6 = view.findViewById(R.id.table_date6);
        table_date7 = view.findViewById(R.id.table_date7);
        table_date8 = view.findViewById(R.id.table_date8);

        table_image1 = view.findViewById(R.id.table_image1);
        table_image2 = view.findViewById(R.id.table_image2);
        table_image3 = view.findViewById(R.id.table_image3);
        table_image4 = view.findViewById(R.id.table_image4);
        table_image5 = view.findViewById(R.id.table_image5);
        table_image6 = view.findViewById(R.id.table_image6);
        table_image7 = view.findViewById(R.id.table_image7);
        table_image8 = view.findViewById(R.id.table_image8);

        table_minTemp1 = view.findViewById(R.id.table_minTemp1);
        table_minTemp2 = view.findViewById(R.id.table_minTemp2);
        table_minTemp3 = view.findViewById(R.id.table_minTemp3);
        table_minTemp4 = view.findViewById(R.id.table_minTemp4);
        table_minTemp5 = view.findViewById(R.id.table_minTemp5);
        table_minTemp6 = view.findViewById(R.id.table_minTemp6);
        table_minTemp7 = view.findViewById(R.id.table_minTemp7);
        table_minTemp8 = view.findViewById(R.id.table_minTemp8);

        table_maxTemp1 = view.findViewById(R.id.table_maxTemp1);
        table_maxTemp2 = view.findViewById(R.id.table_maxTemp2);
        table_maxTemp3 = view.findViewById(R.id.table_maxTemp3);
        table_maxTemp4 = view.findViewById(R.id.table_maxTemp4);
        table_maxTemp5 = view.findViewById(R.id.table_maxTemp5);
        table_maxTemp6 = view.findViewById(R.id.table_maxTemp6);
        table_maxTemp7 = view.findViewById(R.id.table_maxTemp7);
        table_maxTemp8 = view.findViewById(R.id.table_maxTemp8);

        this.city = getArguments().getString("city");
        this.forecastData = getArguments().getString("forecastData");
        makeView(this.city, this.forecastData);
        return view;
    }

    private void makeView(String city, String forecastData) {
        card1_city.setText(city);

        try {
            JSONObject forecast = new JSONObject(forecastData);
            JSONObject currently = forecast.getJSONObject("currently");

            String icon = currently.getString("icon");
            setIcon(card1_image, icon);

            int temp = (int) Math.round(currently.getDouble("temperature"));
            card1_temp.setText("" + temp);
            card1_summary.setText(currently.getString("summary"));
            int humidity = (int) Math.round(currently.getDouble("humidity") * 100);
            card2_humidity.setText("" + humidity + " %");
            card2_windSpeed.setText("" + Math.round(currently.getDouble("windSpeed") *100) / 100.0 + " mph");
            card2_visibility.setText("" + Math.round(currently.getDouble("visibility")*100) / 100.0 + " km");
            card2_pressure.setText("" + Math.round(currently.getDouble("pressure") * 100) / 100.0 + " mb");

            JSONObject daily = forecast.getJSONObject("daily");
            JSONArray data = daily.getJSONArray("data");
            String [] times = new String[8];
            String [] icons = new String[8];
            int [] tempLow = new int[8];
            int [] tempHigh = new int[8];

            for (int i = 0; i < 8; i++) {
                JSONObject c = data.getJSONObject(i);

                times[i] = convertTime(c.getLong("time"));
                icons[i]= c.getString("icon");
                tempLow[i] = (int) Math.round(c.getLong("temperatureLow"));
                tempHigh[i] = (int) Math.round(c.getLong("temperatureHigh"));
            }

            table_date1.setText(times[0]);
            table_date2.setText(times[1]);
            table_date3.setText(times[2]);
            table_date4.setText(times[3]);
            table_date5.setText(times[4]);
            table_date6.setText(times[5]);
            table_date7.setText(times[6]);
            table_date8.setText(times[7]);

            setIcon(table_image1, icons[0]);
            setIcon(table_image2, icons[1]);
            setIcon(table_image3, icons[2]);
            setIcon(table_image4, icons[3]);
            setIcon(table_image5, icons[4]);
            setIcon(table_image6, icons[5]);
            setIcon(table_image7, icons[6]);
            setIcon(table_image8, icons[7]);

            table_minTemp1.setText("" + tempLow[0]);
            table_minTemp2.setText("" + tempLow[1]);
            table_minTemp3.setText("" + tempLow[2]);
            table_minTemp4.setText("" + tempLow[3]);
            table_minTemp5.setText("" + tempLow[4]);
            table_minTemp6.setText("" + tempLow[5]);
            table_minTemp7.setText("" + tempLow[6]);
            table_minTemp8.setText("" + tempLow[7]);

            table_maxTemp1.setText("" + tempHigh[0]);
            table_maxTemp2.setText("" + tempHigh[1]);
            table_maxTemp3.setText("" + tempHigh[2]);
            table_maxTemp4.setText("" + tempHigh[3]);
            table_maxTemp5.setText("" + tempHigh[4]);
            table_maxTemp6.setText("" + tempHigh[5]);
            table_maxTemp7.setText("" + tempHigh[6]);
            table_maxTemp8.setText("" + tempHigh[7]);

        } catch (JSONException e) {
            Log.d("MAIN FRAGMENT" + getArguments().getString("position"), "error");
        }
    }

    private void setIcon(ImageView v, String icon) {
        switch(icon) {
            case "clear-night":
                v.setImageResource(R.drawable.weather_night);
                break;
            case "rain":
                v.setImageResource(R.drawable.weather_rainy);
                break;
            case "sleet":
                v.setImageResource(R.drawable.weather_snowy_rainy);
                break;
            case "snow":
                v.setImageResource(R.drawable.weather_snowy);
                break;
            case "wind":
                v.setImageResource(R.drawable.weather_windy_variant);
                break;
            case "fog":
                v.setImageResource(R.drawable.weather_fog);
                break;
            case "cloudy":
                v.setImageResource(R.drawable.weather_cloudy);
                break;
            case "partly-cloudy-night":
                v.setImageResource(R.drawable.weather_night_partly_cloudy);
                break;
            case "weather-partly-cloudy":
                v.setImageResource(R.drawable.weather_partly_cloudy);
                break;
            default:
                v.setImageResource(R.drawable.weather_sunny);
        }
    }
    private String convertTime(Long time) {
        Date date = new Date(time*1000); // *1000 is to convert seconds to milliseconds
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy"); // the format of your date
        sdf.setTimeZone(TimeZone.getTimeZone("GMT-4"));
        String formattedDate = sdf.format(date);
        return formattedDate;
    }

}
