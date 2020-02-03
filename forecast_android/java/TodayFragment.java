package com.example.weatherapp;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link TodayFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link TodayFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TodayFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";

    TextView windSpeed;
    TextView pressure;
    TextView precipitation;
    TextView temperature;
    TextView humidity;
    TextView visibility;
    TextView cloudCover ;
    TextView ozone;
    ImageView summary_image;
    TextView summary_txt;

    // TODO: Rename and change types of parameters
    private String mParam1;

    private OnFragmentInteractionListener mListener;

    public TodayFragment() {
        // Required empty public constructor
    }

    public static TodayFragment newInstance(String param1) {
        TodayFragment fragment = new TodayFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            //TODO:data parse
        }
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        super.onCreateView(inflater, container, savedInstanceState);
        View rootView = inflater.inflate(R.layout.fragment_today, container, false);
        windSpeed = rootView.findViewById(R.id.windSpeed);
        pressure = rootView.findViewById(R.id.pressure);
        precipitation = rootView.findViewById(R.id.precipitation);
        temperature = rootView.findViewById(R.id.temperature);
        humidity = rootView.findViewById(R.id.humidity);
        visibility = rootView.findViewById(R.id.visibility);
        cloudCover = rootView.findViewById(R.id.cloudCover);
        ozone = rootView.findViewById(R.id.ozone);
        summary_image = rootView.findViewById(R.id.todaySummaryImg);
        summary_txt = rootView.findViewById(R.id.todaySummaryTxt);

        makeView();

        return rootView;
    }

    private void makeView() {
        try {
            JSONObject currently = new JSONObject(mParam1);

            String icon = currently.getString("icon");
            setIcon(summary_image, icon);

            int temp = (int) Math.round(currently.getDouble("temperature"));
            temperature.setText("" + temp);
            summary_txt.setText(currently.getString("summary"));
            int num_humidity = (int) Math.round(currently.getDouble("humidity") * 100);
            humidity.setText("" + num_humidity + "%");
            windSpeed.setText("" + Math.round(currently.getDouble("windSpeed") *100) / 100.0 + " mph");
            visibility.setText("" + Math.round(currently.getDouble("visibility")*100) / 100.0 + " km");
            pressure.setText("" + Math.round(currently.getDouble("pressure") * 100) / 100.0 + " mb");
            precipitation.setText(""+ Math.round(currently.getDouble("precipitation") *100) / 100.0 + " mmph");
            cloudCover.setText("" + (int) Math.round(currently.getDouble("cloudCover") * 100) + "%");
            ozone.setText("" + Math.round(currently.getDouble("ozone") *100) / 100.0 + " DU");
        } catch(JSONException e) {
            Log.d("TODAY FRAGMENT", "failed to parse json");
        }
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
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
}
