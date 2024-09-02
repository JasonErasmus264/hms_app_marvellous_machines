import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';
import 'uploaded_file.dart';
import '/backend/schema/structs/index.dart';
import '/auth/custom_auth/auth_util.dart';

bool isAssignmentOpen(
  String openDatetimeStr,
  String dueDatetimeStr,
) {
  // Define the date format pattern that matches the input string
  final DateFormat dateFormat = DateFormat('dd MMMM yyyy \'at\' HH:mm');

  try {
    // Parse the string dates into DateTime objects
    DateTime openDatetime = dateFormat.parse(openDatetimeStr);
    DateTime dueDatetime = dateFormat.parse(dueDatetimeStr);

    // Get the current date and time
    DateTime now = DateTime.now();

    // Check if the current time is between openDatetime and dueDatetime
    if ((now.isAfter(openDatetime) || now.isAtSameMomentAs(openDatetime)) &&
        now.isBefore(dueDatetime)) {
      return true; // Assignment is open
    } else {
      return false; // Assignment is not open
    }
  } catch (e) {
    print("Error parsing date: $e");
    return false; // Return false if there's an error in date parsing
  }
}
