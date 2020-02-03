package com.example.weatherapp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.Uri;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TabLayout;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {
    //for permission
    private static final String TAG = MainActivity.class.getSimpleName();

    //location
    private String location;
    private static final String SERVER = "http://singoh8.us-east-2.elasticbeanstalk.com/darkLocation?location=";
    private List<String> cities = new ArrayList<String>( Arrays.asList(""));

    // forecast api call
    private List<String> forecastDatas = new ArrayList<String>( Arrays.asList(""));
    RequestQueue requestQueue;

    //for floating action button
    private FloatingActionButton fab;
    boolean flag;

    //for tab
    private ViewPager viewPager;
    private ViewPagerAdapter adapter;
    private TabLayout tabLayout;
    public List<String> tabLists = new ArrayList<>();

    //progress bar
//    private ProgressBar spinner;
    private LinearLayout progressBar;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        forecastDatas.add(location);

        Toolbar tb = (Toolbar)findViewById(R.id.app_toolbar);
        setSupportActionBar(tb);

        //permission, location
        if(requestQueue == null){
            requestQueue = Volley.newRequestQueue(getApplicationContext());
        }

        //viewpager
        adapter = new ViewPagerAdapter(getSupportFragmentManager());

        fab = (FloatingActionButton) findViewById(R.id.favorite);
//        fab.setImageResource(R.drawable.map_marker_plus);
        flag = true;

//        spinner = findViewById(R.id.progressbar);
        progressBar = findViewById(R.id.linear_progress);
        sendRequestIpApi();
        detectFavorite();

    }

    // using toolbar
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.appbar_action, menu);
        return true;
    }

    private void addTab(String title, int position) {
        Log.d(TAG, "forecast size: "+forecastDatas.size());
        Log.d(TAG, "cities size:" + cities.size());
//        tabLayout.addTab(tabLayout.newTab().setText(title));
//        forecastDatas.add(forecastDatas.get(position));
//        cities.add(cities.get(position));
        addTabPage(title);
    }

    private void addTabPage(String title) {
        tabLists.add(title);
//        tabLists.put(title);
        adapter.notifyDataSetChanged();
//        forecastDatas.add();
    }

    private void removeTab(int position) {
//        int tab_position=tabLayout.getSelectedTabPosition();
//        if (position != 0) {
//            forecastDatas.remove(position);
//            cities.remove(position);
//        }
        if (tabLayout.getTabCount() >= 2){
            tabLayout.removeTabAt(position);
            removeTabPage(position);
        }
    }

    private void removeTabPage(int position) {
        if (!tabLists.isEmpty() && position < tabLists.size()) {
            tabLists.remove(position);
            adapter.notifyDataSetChanged();
//            forecastDatas.remove(position);
        }
    }

    private void prepareView() {
        createTab();
        detectTabChange();

        progressBar.setVisibility(View.GONE);
    }

    private void createTab() {
        viewPager = findViewById(R.id.pager);
        tabLayout = findViewById(R.id.tabs);
//        adapter = new ViewPagerAdapter(getSupportFragmentManager());
        viewPager.setAdapter(adapter);
        tabLayout.setupWithViewPager(viewPager, true);
        viewPager.setOffscreenPageLimit(1);
        viewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        viewPager.removeOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));

        addTab(""+0, 0);
//        for(int i =1; i<=3; i++) {
//            addTab("" + i);
//        }
//
//        removeTab(2);
    }

    private void detectFavorite() {
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int position = viewPager.getCurrentItem();
                    if (flag) {
                        flag = false;
                        fab.setImageResource(R.drawable.map_marker_minus);
                        if(tabLayout.getSelectedTabPosition() == 0) {
                            fab.hide();
                        }
                        forecastDatas.add(forecastDatas.get(tabLayout.getSelectedTabPosition()));
                        cities.add(cities.get(tabLayout.getSelectedTabPosition()));
                        int pos = tabLists.size();
                        addTab(""+ pos, tabLayout.getSelectedTabPosition());
                        Toast.makeText(getApplicationContext(),cities.get(tabLayout.getSelectedTabPosition()) + " was added to favorite", Toast.LENGTH_SHORT).show();
                    }
                    else {
                        fab.setImageResource(R.drawable.map_marker_plus);
                        flag = true;
                        Toast.makeText(getApplicationContext(),cities.get(position) + " was removed from favorite", Toast.LENGTH_SHORT).show();
                        if (tabLayout.getSelectedTabPosition() !=0 ) {
                            removeTab(tabLayout.getSelectedTabPosition());
                        }
                        forecastDatas.remove(tabLayout.getSelectedTabPosition());
                        cities.remove(tabLayout.getSelectedTabPosition());
                    }

            }
        });
    }

    private void detectTabChange() {
        tabLayout.addOnTabSelectedListener(new TabLayout.ViewPagerOnTabSelectedListener(viewPager) {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                super.onTabSelected(tab);
                int pos = tab.getPosition() ;
                if (pos == 0) {
                    if(flag == false) {
                        fab.hide();
//                        fab.setImageResource(R.drawable.map_marker_minus);
                    }
                    else {
                        fab.show();
//                        fab.setImageResource(R.drawable.map_marker_plus);
                    }
                }
                else {
                    fab.show();
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
                // TODO : tab의 상태가 선택되지 않음으로 변경.
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                int pos = tab.getPosition() ;
                if (pos == 0) {
                    if(flag == false) {
                        fab.hide();
//                        fab.setImageResource(R.drawable.map_marker_minus);
                    }
                    else {
                        fab.show();
//                        fab.setImageResource(R.drawable.map_marker_plus);
                    }
                }
                else {
                    fab.show();
//                    fab.setImageResource(R.drawable.map_marker_plus);
                }
            }
        });
//        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
//
//            @Override
//            public void onPageSelected(int position) {
//                if (position == 0) {
//                    // TODO : 조건에 따라 icon 바꾸기
//                    fab.hide();
//                } else {
////                    fab.setImageResource(android.R.drawable.ic_dialog_email);
//                    fab.show();
//                }
//            }
//
//            @Override
//            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {}
//
//            @Override
//            public void onPageScrollStateChanged(int state) {}
//        });
    }

    @Override
    public void onStart() {
        Log.d(TAG, "onStart");
        super.onStart();
    }

    /******** http request***************/

    public void sendDarkRequest(boolean current) {
        final boolean curr = current;
        Log.d(TAG,"called send request");
        String url = SERVER + location;
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        String test = response;
                        Log.d(TAG,"IN RESPONSE"+test);

                        Log.d(TAG, "In forecast Arraylist: " + forecastDatas.get(0));
                        if (true) {
                            forecastDatas.set(0, response);
                        }
                        else {
                            forecastDatas.add(response);
                        }
                        prepareView();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG,"DarkSky error! : " + error);
            }
        });

        requestQueue.add(stringRequest);
//
    }

    public void sendRequestIpApi() {
        String url = "http://ip-api.com/json";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        String lat = "";
                        String lon = "";
                        String city = "";
                        String state = "";
                        String country = "";
                        Log.d(TAG,"IN IP-API RESPONSE"+response);
                        try {
                            JSONObject json = new JSONObject(response);
                            lat = json.getString("lat");
                            lon = json.getString("lon");

                            location = "" + lat + "," + lon;

                            city = json.getString("city");
                            state = json.getString("region");
                            country = json.getString("countryCode");

                            cities.set(0, city +", " + state + ", " + country);
                            sendDarkRequest(true);

                        }catch (JSONException e){
                            Log.d(TAG, "error");
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "IN IP-API RES error! : " + error);
            }
        });
        requestQueue.add(stringRequest);
    }

    public void extractData(String data) {
        Log.d(TAG, "in extractData");
        try
        {
            JSONObject jsonObject = new JSONObject(data);
            String currently = jsonObject.getString("currently");
            Log.d(TAG, "forecast.currently"+currently);
//            forecastRes.setText(currently);

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    //viewpager class
    public class ViewPagerAdapter extends FragmentStatePagerAdapter {

        public ViewPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            Log.d("ViewPagerAdapter", "called getItem");
//            if(position == 0) {
//                fab.hide();
//            }
            Log.d("ViewPagerAdapter forecast data", forecastDatas.get(position));
//            switch (position) {
//                case 0:
//                    return MainSummaryFragment.newInstance(position,
//                            forecastDatas.get(position), cities.get(position));
//                default:
//                    return FavFragment.newInstance(position,
//                            forecastDatas.get(position), cities.get(position));
//            }

            return MainSummaryFragment.newInstance(position,
                    forecastDatas.get(position), cities.get(position));
        }

        @Override
        public int getCount() {
            return tabLists.size();
        }


    }

}
