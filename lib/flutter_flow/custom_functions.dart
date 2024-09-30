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

String? formatTextForJson(String inputText) {
  return inputText.trim().replaceAll('\n', '\\n');
}

String? convertImagePath(String? imagePath) {
  return imagePath;
}

String? convertVidPath(String? submissionVidPath) {
  return submissionVidPath;
}

DateTime? convertDate(String? formattedDate) {
  if (formattedDate == null || formattedDate.isEmpty) {
    return null;
  }

  try {
    // Define the date format according to the given string '01 September 2024 at 12:00'
    final DateFormat dateFormat = DateFormat('dd MMMM yyyy \'at\' HH:mm');
    return dateFormat.parse(formattedDate);
  } catch (e) {
    // If parsing fails, return null or handle error accordingly
    print('Error parsing date: $e');
    return null;
  }
}

int convertStringToInt(String assignID) {
  return int.tryParse(assignID) ?? 0;
}

String getVideoName(String vidPath) {
  final parts = vidPath.split('/');
  return parts.isNotEmpty ? parts.last : '';
}
