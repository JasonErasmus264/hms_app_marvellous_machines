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

bool checkVideoSize(FFUploadedFile? videoFile) {
  // Get the size of the uploaded video file and check if it is over 100MB
  if (videoFile != null) {
    var bytes = videoFile.bytes;
    if (bytes != null) {
      int fileSizeInBytes = bytes.length;
      double fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      return fileSizeInMB > 100; // Return true if file size is over 100MB
    }
  }
  return false; // Return false if file is null or size is not over 100MB
}

bool isTokenExpired(String accessToken) {
  try {
    // Split the token into its parts: header, payload, and signature
    final parts = accessToken.split('.');
    if (parts.length != 3) {
      return true; // Invalid token format
    }

    // Decode the payload from Base64
    final payload = parts[1];
    final normalizedPayload = base64Url.normalize(payload);
    final decodedPayload = utf8.decode(base64Url.decode(normalizedPayload));

    // Convert the payload into a JSON map
    final payloadMap = jsonDecode(decodedPayload);

    // Check if the 'exp' field exists
    if (payloadMap.containsKey('exp')) {
      final expiration = payloadMap['exp'];

      // Get the current time (in seconds)
      final currentTime = DateTime.now().millisecondsSinceEpoch / 1000;

      // Return true if the current time is greater than the expiration time
      return currentTime >= expiration;
    }

    return true; // If there's no 'exp' field, assume the token is expired
  } catch (e) {
    // If any error occurs (e.g., token parsing failed), assume it's expired
    print('Error parsing token: $e');
    return true;
  }
}
