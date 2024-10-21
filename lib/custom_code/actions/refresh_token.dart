import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
import '/backend/api_requests/api_interceptor.dart';
import '/auth/custom_auth/auth_util.dart';
import 'package:http/http.dart' as http;
import '/backend/api_requests/api_calls.dart';
import 'dart:convert'; // Ensure jsonDecode is imported

// Class for refreshing tokens by intercepting API requests
class RefreshToken extends FFApiInterceptor {
  
  // This function intercepts API requests and refreshes the token if expired
  @override
  Future<ApiCallOptions> onRequest({
    required ApiCallOptions options, // The current API call options
  }) async {
    try {
      // Get the current access and refresh tokens from the authentication manager
      final String? accessToken = currentAuthenticationToken;
      final String? refreshToken = currentAuthRefreshToken;

      // Check if the access token exists and has expired
      if (accessToken != null && isTokenExpired(accessToken)) {
        
        // If a refresh token is available, make a request to refresh the access token
        if (refreshToken != null) {
          
          // Define the API endpoint for refreshing the token
          final url = Uri.parse('http://192.168.3.66:3000/v1/refresh-token'); // Change localhost to your IP for mobile

          // Send a POST request to refresh the token using the refresh token
          final response = await http.post(
            url,
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
              'Authorization': 'Bearer $refreshToken', // Include refresh token in the authorization header
            },
          );

          // If the request was successful (HTTP 200), parse the response data
          if (response.statusCode == 200) {
            final responseData = jsonDecode(response.body); // Decode the JSON response
            final String? newAccessToken = responseData['accessToken']; // Extract new access token
            final String? newRefreshToken = responseData['refreshToken']; // Extract new refresh token
            final String? userType = responseData['userType']; // Extract user type

            // Ensure all necessary data (tokens, userType) is present
            if (newAccessToken != null && newRefreshToken != null && userType != null) {
              
              // Update the authentication manager with new tokens and user data
              authManager.updateAuthUserData(
                authenticationToken: newAccessToken,
                refreshToken: newRefreshToken,
                userData: UserStruct(userType: userType), // Update the user type in user data
              );

              // Update the API call options with the new access token
              options.headers['Authorization'] = 'Bearer $newAccessToken';
            } else {
              // If the response data is missing required fields, throw an error
              throw Exception('Invalid response data: Missing tokens or userType.');
            }
          } else {
            // If the request failed
            throw Exception('Failed to refresh token: ${response.body}');
          }
        } else {
          // If the refresh token is null
          throw Exception('Refresh token is null.');
        }
      } else if (accessToken != null) {
        // If the access token is still valid, just add it to the API call headers
        options.headers['Authorization'] = 'Bearer $accessToken';
      } else {
        // If no access token is available
        throw Exception('Access token is null.');
      }
    } catch (e) {
      // If any error occurs during token refresh, sign out the user
      await authManager.signOut();
      throw Exception('Error during token refresh: $e');
    }

    // Return the updated API call options (with possibly refreshed tokens)
    return options;
  }

  // This function intercepts the API response, but doesn't alter it (optional override)
  @override
  Future<ApiCallResponse> onResponse({
    required ApiCallResponse response, // The original API response
    required Future<ApiCallResponse> Function() retryFn, // A function to retry the request
  }) async {
    return response; // Just return the response as is
  }
}