package com.qyk.app.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.qyk.app.quotes.QuoteRepository

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        // Fire notification
        val quote = QuoteRepository.getNext(context)
        NotificationHelper.showQuoteNotification(context, "Qyk Quote", quote)
        // Reschedule for tomorrow
        DailyAlarmScheduler.scheduleNext(context)
    }
}
