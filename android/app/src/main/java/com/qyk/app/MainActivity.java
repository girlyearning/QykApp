package com.qyk.app;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.qyk.app.quotes.QykQuotesPlugin;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(QykQuotesPlugin.class);
  }
}
