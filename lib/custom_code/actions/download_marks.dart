// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:download/download.dart';

Future downloadMarks(
  String assignmentID,
  String format,
  String token,
) async {
  try {
    // Create the download URL (adjust your backend URL accordingly)
    final url = Uri.parse(
        'http://localhost:3000/v1/download-marks/$assignmentID/$format');

    // Make the GET request to the backend with Authorization header
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token', // Include the Bearer token in headers
        'Accept': 'application/octet-stream', // For file download
      },
    );

    // Check if the response is successful
    if (response.statusCode == 200) {
      // Get the file data (as Uint8List)
      Uint8List fileData = response.bodyBytes;

      // Convert Uint8List to Stream<int>
      Stream<int> fileStream = Stream.fromIterable(fileData);

      // Define the file name based on the format
      final fileName = 'student_marks.$format';

      // Download the file using the 'download' package
      await download(fileStream, fileName);

      print('File downloaded successfully: $fileName');
    } else {
      print('Failed to download the file. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error occurred while downloading the file: $e');
  }
}
