package com.example.weatherapp;

import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link WeeklyFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link WeeklyFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WeeklyFragment extends Fragment {
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";

    private String mParam1;
    private ImageView summary_image;
    private TextView summary_text;
    int [] tempLow = new int[8];
    int [] tempHigh = new int[8];
    private ArrayList<Entry> tempLowData = new ArrayList<Entry>();
    private ArrayList<Entry> tempHighData = new ArrayList<Entry>();
    LineChart linechart;

    private OnFragmentInteractionListener mListener;

    public WeeklyFragment() {
        // Required empty public constructor
    }

    public static WeeklyFragment newInstance(String param1) {
        WeeklyFragment fragment = new WeeklyFragment();
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
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        super.onCreateView(inflater, container, savedInstanceState);
        View rootView = inflater.inflate(R.layout.fragment_weekly, container, false);
        summary_image = rootView.findViewById(R.id.summary_image);
        summary_text = rootView.findViewById(R.id.summary_txt);
        linechart = rootView.findViewById(R.id.chart);
        makeView();


        return rootView;
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

    private void makeView() {
        try {
            JSONObject daily = new JSONObject(mParam1);
            String summary_img = daily.getString("icon");
            setIcon(summary_image, summary_img);
            summary_text.setText(daily.getString("summary"));

            JSONArray data = daily.getJSONArray("data");

            tempLow = new int[8];
            tempHigh = new int[8];

            for (int i = 0; i < 8; i++) {
                JSONObject c = data.getJSONObject(i);
                tempLow[i] = (int) Math.round(c.getLong("temperatureLow"));
                tempHigh[i] = (int) Math.round(c.getLong("temperatureHigh"));
            }
            makeChart();

        } catch (JSONException e) {
            Log.d("WeeklyFragment", "cannot parse the JSON");
        }

    }

    private void makeChart() {
        int i = 0;
        for (int data : tempLow) {
            tempLowData.add(new Entry(i, data));
            ++i;
        }
        i = 0;
        for (int data : tempHigh) {
            tempHighData.add(new Entry(i, data));
            ++i;
        }

        LineDataSet tempLowSet = new LineDataSet(tempLowData, "Minimum Temperature");
        LineDataSet tempHighSet = new LineDataSet(tempHighData, "Maximum Temperature");

        tempLowSet.setColors(new int[] { R.color.app_purple }, getContext());
        tempHighSet.setColors(new int[] { R.color.app_yellow}, getContext());
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();

        dataSets.add(tempLowSet);
        dataSets.add(tempHighSet);

        Legend l = linechart.getLegend();
        l.setTextColor(Color.WHITE);
        l.setTextSize(15f);

        linechart.getAxisLeft().setTextColor(Color.WHITE);
        linechart.getAxisRight().setTextColor(Color.WHITE);
        linechart.getXAxis().setTextColor(Color.WHITE);

        LineData lineData = new LineData(dataSets);
        linechart.setData(lineData);
        linechart.invalidate();
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
