package com.qyk.app.quotes

import android.Manifest
import android.os.Build
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.qyk.app.notifications.DailyAlarmScheduler
import com.qyk.app.notifications.NotificationHelper
import com.qyk.app.quotes.QuoteRepository
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationManagerCompat

@CapacitorPlugin(name = "QykQuotes")
class QykQuotesPlugin : Plugin() {

    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= 33) {
            bridge.activity?.let { act ->
                ActivityCompat.requestPermissions(act, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 3467)
            }
        }
        call.resolve()
    }

    @PluginMethod
    fun scheduleDailyQuote(call: PluginCall) {
        val hour = call.getInt("hour") ?: 9
        val minute = call.getInt("minute") ?: 0
        val ctx = context
        DailyAlarmScheduler.schedule(ctx, hour, minute)
        NotificationHelper.ensureChannel(ctx)
        call.resolve()
    }

    @PluginMethod
    fun cancelDailyQuote(call: PluginCall) {
        DailyAlarmScheduler.cancel(context)
        call.resolve()
    }

    @PluginMethod
    fun getState(call: PluginCall) {
        val s = DailyAlarmScheduler.getState(context)
        val ret = JSObject()
        ret.put("enabled", s.enabled)
        ret.put("hour", s.hour)
        ret.put("minute", s.minute)
        call.resolve(ret)
    }

    @PluginMethod
    fun testNotify(call: PluginCall) {
        // Ensure permission (Android 13+)
        if (Build.VERSION.SDK_INT >= 33) {
            val granted = ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
            if (!granted) {
                bridge.activity?.let { act ->
                    ActivityCompat.requestPermissions(act, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 3467)
                }
                call.resolve()
                return
            }
        }

        // If notifications are disabled at OS level, open settings
        val nm = NotificationManagerCompat.from(context)
        if (!nm.areNotificationsEnabled()) {
            try {
                val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                    .putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                bridge.activity?.startActivity(intent) ?: context.startActivity(intent)
            } catch (_: Exception) { }
            call.resolve()
            return
        }

        val quote = QuoteRepository.getNext(context)
        NotificationHelper.showQuoteNotification(context, "Qyk Quote", quote)
        call.resolve()
    }
}
