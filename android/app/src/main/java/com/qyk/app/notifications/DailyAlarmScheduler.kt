package com.qyk.app.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar

object DailyAlarmScheduler {
    private const val PREFS = "qyk_quotes_prefs"
    private const val KEY_ENABLED = "enabled"
    private const val KEY_HOUR = "hour"
    private const val KEY_MINUTE = "minute"

    fun schedule(context: Context, hour: Int, minute: Int) {
        saveState(context, true, hour, minute)
        scheduleInternal(context, hour, minute)
    }

    fun cancel(context: Context) {
        saveState(context, false, null, null)
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        am.cancel(pendingIntent(context))
    }

    fun ensureScheduled(context: Context) {
        val state = getState(context)
        if (state.enabled) {
            scheduleInternal(context, state.hour ?: 9, state.minute ?: 0)
        }
    }

    fun scheduleNext(context: Context) {
        val state = getState(context)
        if (!state.enabled) return
        scheduleInternal(context, state.hour ?: 9, state.minute ?: 0, addDay = true)
    }

    private fun scheduleInternal(context: Context, hour: Int, minute: Int, addDay: Boolean = false) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val triggerAt = nextTriggerAt(hour, minute, addDay)
        val pi = pendingIntent(context)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
        } else {
            am.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pi)
        }
    }

    private fun nextTriggerAt(hour: Int, minute: Int, addDay: Boolean): Long {
        val cal = Calendar.getInstance()
        cal.timeInMillis = System.currentTimeMillis()
        if (addDay) cal.add(Calendar.DAY_OF_YEAR, 1)
        cal.set(Calendar.HOUR_OF_DAY, hour)
        cal.set(Calendar.MINUTE, minute)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        if (!addDay && cal.timeInMillis <= System.currentTimeMillis()) {
            cal.add(Calendar.DAY_OF_YEAR, 1)
        }
        return cal.timeInMillis
    }

    private fun pendingIntent(context: Context): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java)
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        return PendingIntent.getBroadcast(context, 1001, intent, flags)
    }

    private fun saveState(context: Context, enabled: Boolean, hour: Int?, minute: Int?) {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs.edit().apply {
            putBoolean(KEY_ENABLED, enabled)
            if (hour != null) putInt(KEY_HOUR, hour)
            if (minute != null) putInt(KEY_MINUTE, minute)
        }.apply()
    }

    fun getState(context: Context): State = run {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        State(
            enabled = prefs.getBoolean(KEY_ENABLED, false),
            hour = if (prefs.contains(KEY_HOUR)) prefs.getInt(KEY_HOUR, 9) else null,
            minute = if (prefs.contains(KEY_MINUTE)) prefs.getInt(KEY_MINUTE, 0) else null
        )
    }

    data class State(val enabled: Boolean, val hour: Int?, val minute: Int?)
}
