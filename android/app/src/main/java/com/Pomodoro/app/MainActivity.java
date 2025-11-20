package com.Pomodoro.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.haptics.HapticsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Registrar el plugin Haptics explícitamente
        registerPlugin(HapticsPlugin.class);
    }
}
