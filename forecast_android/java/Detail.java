package com.example.weatherapp;

import android.content.Intent;
import android.net.Uri;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

public class Detail extends AppCompatActivity
        implements TodayFragment.OnFragmentInteractionListener,
                    WeeklyFragment.OnFragmentInteractionListener,
                    PhotosFragment.OnFragmentInteractionListener
{
    String city;
    String forecastData;
    String currently;
    String daily;
    int temp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        //get data from main activity
        Intent myIntent = getIntent();
        city = myIntent.getStringExtra("city");
        forecastData = myIntent.getStringExtra("forecastData");
        parseData();

        //toolbar
        Toolbar tb = (Toolbar)findViewById(R.id.detail_toolbar);
        setSupportActionBar(tb);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle(city);

        //viewpager
        ViewPager viewPager = findViewById(R.id.detail_view_pager);
        viewPager.setAdapter(new DetailViewPagerAdapter(getSupportFragmentManager()));

        //tablayout
        TabLayout tabLayout = findViewById(R.id.detail_tab_layout);
        tabLayout.setupWithViewPager(viewPager);

        setupTabLayout(tabLayout);
    }

    // using toolbar
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.detail_actionbar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {
            case android.R.id.home:
                this.finish();
                return true;
            case R.id.detail_twitter:
                ///TODO: URI 체크하기
                Intent intent = new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://twitter.com/intent/tweet?text="
                                + "Check Out " + city + "'s Weather! It is " + temp
                                + "! %23CSCI571WeatherSearch"));
                startActivity(intent);
                return true;
        }
        return false;
    }

    @Override
    public void onFragmentInteraction(Uri uri){
            //you can leave it empty
    }

    private void setupTabLayout(TabLayout tab) {
        tab.getTabAt(0).setIcon(R.drawable.calendar_today);
        tab.getTabAt(1).setIcon(R.drawable.trending_up);
        tab.getTabAt(2).setIcon(R.drawable.google_photos);
    }

    private void parseData() {
        try {
            JSONObject forecast = new JSONObject(forecastData);
            JSONObject curr_json = forecast.getJSONObject("currently");
            temp = (int)Math.round(curr_json.getDouble("temperature"));

            currently = forecast.getString("currently");
            daily = forecast.getString("daily");

        } catch (JSONException e) {
            Log.d("DetailActivity", "Can not parse JSON object.");
        }

    }


    public class DetailViewPagerAdapter extends FragmentPagerAdapter {

        private Fragment[] childFragments;

        public DetailViewPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            switch(position) {
                case 0:
                    return(TodayFragment.newInstance(currently));
                case 1:
                    return(WeeklyFragment.newInstance(daily));
                case 2:
                    return(PhotosFragment.newInstance(city));
            }
//            return childFragments[position];
            return null;
        }

        @Override
        public int getCount() {
            return 3;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            String[] tabNames = {"TODAY", "WEEKLY", "PHOTOS"};
//            String title = getItem(position).getClass().getName();
//            return title.subSequence(title.lastIndexOf(".") + 1, title.length());
            return tabNames[position];
        }
    }

//    public void sendCustomRequest(boolean current) {
//        final boolean curr = current;
//        Log.d(TAG,"called send request");
//        String url = SERVER + location;
//        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
//                new Response.Listener<String>() {
//                    @Override
//                    public void onResponse(String response) {
//                        String test = response;
//                        Log.d(TAG,"IN RESPONSE"+test);
//
//                        if (true) {
//                            forecastDatas.set(0, response);
//                        }
//                        else {
//                            forecastDatas.add(response);
//                        }
//                        prepareView();
//                    }
//                }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                Log.d(TAG,"DarkSky error! : " + error);
//            }
//        });
//
//        requestQueue.add(stringRequest);
////
//    }

}
