import 'dart:io';
import 'dart:convert';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:syncfusion_flutter_xlsio/xlsio.dart' hide Column hide Row;
import 'package:open_file/open_file.dart';
import 'package:http/http.dart' as http;
import 'feedback_model.dart';
export 'feedback_model.dart';

class FeedbackWidget extends StatefulWidget {
  const FeedbackWidget({super.key});

  @override
  State<FeedbackWidget> createState() => _FeedbackWidgetState();
}

class _FeedbackWidgetState extends State<FeedbackWidget> {
  late FeedbackModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => FeedbackModel());
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  // xlsx
  Future<void> createExcel() async {
    try {
      // Fetch feedback data 
      final response = await http.get(Uri.parse('http://192.168.3.66:3000/api/v1/feedback'));

      if (response.statusCode == 200) {
        final List<dynamic> feedbackList = json.decode(response.body);

        // Create Excel workbook and worksheet
        final Workbook workbook = Workbook();
        final Worksheet sheet = workbook.worksheets[0];

        // Headers
        sheet.getRangeByName('A1').setText('username');
        sheet.getRangeByName('B1').setText('Last Name');
        sheet.getRangeByName('C1').setText('First Names');
        sheet.getRangeByName('D1').setText('Assignment');
        sheet.getRangeByName('E1').setText('Mark');
        sheet.getRangeByName('F1').setText('Comment');

        // Populate sheet
        for (int i = 0; i < feedbackList.length; i++) {
          final feedback = feedbackList[i];
          sheet.getRangeByName('A${i + 2}').setText(feedback['username'].toString());
          sheet.getRangeByName('B${i + 2}').setText(feedback['lastName'].toString());
          sheet.getRangeByName('C${i + 2}').setText(feedback['firstName'].toString());
          sheet.getRangeByName('D${i + 2}').setText(feedback['assignName'].toString());
          sheet.getRangeByName('E${i + 2}').setNumber(
            double.tryParse(feedback['mark'].toString()) ?? 0.0);
          sheet.getRangeByName('F${i + 2}').setText(feedback['comment'].toString());
        }

        // Save workbook
        final List<int> bytes = workbook.saveAsStream();
        workbook.dispose();

        
        final Directory directory = await getApplicationSupportDirectory();
        final String path = directory.path;
        final String fileName = '$path/Feedback.xlsx';
        final File file = File(fileName);
        await file.writeAsBytes(bytes, flush: true);

        // Open file
        OpenFile.open(fileName);
      } else {
        print('Failed to load feedback data');
      }
    } catch (e) {
      print('Error creating Excel file: $e');
    }
  }

  // CSV
  Future<void> createCSV() async {
  try {
    // Fetch feedback data 
    final response = await http.get(Uri.parse('http://192.168.3.66:3000/api/v1/feedback'));
    if (response.statusCode != 200) {
      print('Failed to load feedback data');
      return;
    }

    final List<dynamic> feedbackList = json.decode(response.body);

    // Build data
    StringBuffer csvData = StringBuffer();

    // Add headers
    csvData.writeln('Username,Last Name,First Names,Assignment,Mark,Comment');

    // Add rows with feedback data
    for (int i = 0; i < feedbackList.length; i++) {
      final feedback = feedbackList[i];
      csvData.writeln([
        feedback['username'].toString(),
        feedback['lastName'].toString(),
        feedback['firstName'].toString(),
        feedback['assignName'].toString(),
        feedback['mark'].toString(),
        feedback['comment'].toString(),
      ].join(','));
    }

    // Save file
    final Directory directory = await getApplicationSupportDirectory();
    final String path = directory.path;
    final String fileName = '$path/Feedback.csv';
    final File file = File(fileName);

    // Write to file
    await file.writeAsString(csvData.toString(), flush: true);
    print('File saved: $fileName');

    // Open file
    OpenFile.open(fileName);
  } catch (e) {
    print('Error creating CSV file: $e');
  }
}

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        appBar: AppBar(
          backgroundColor: Color(0xFF6D5FED),
          automaticallyImplyLeading: false,
          leading: FlutterFlowIconButton(
            borderRadius: 20.0,
            borderWidth: 1.0,
            buttonSize: 40.0,
            icon: Icon(
              Icons.arrow_back,
              color: FlutterFlowTheme.of(context).secondaryBackground,
              size: 24.0,
            ),
            onPressed: () async {
              context.pop();
            },
          ),
          title: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(75.0, 0.0, 0.0, 0.0),
            child: Text(
              'Feedback',
              textAlign: TextAlign.center,
              style: FlutterFlowTheme.of(context).headlineMedium.override(
                    fontFamily: 'Outfit',
                    color: Colors.white,
                    fontSize: 22.0,
                    letterSpacing: 0.0,
                  ),
            ),
          ),
          actions: [],
          centerTitle: false,
          elevation: 2.0,
        ),
        body: SafeArea(
          top: true,
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(10.0, 0.0, 10.0, 0.0),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 100.0, 0.0, 0.0),
                  child: Card(
                    clipBehavior: Clip.antiAliasWithSaveLayer,
                    color: Color(0xFF22282F),
                    elevation: 4.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              25.0, 20.0, 0.0, 20.0),
                          child: FFButtonWidget(
                            onPressed: () {
                              createExcel();
                            },
                            text: 'View Feedback',
                            options: FFButtonOptions(
                              width: 300.0,
                              height: 40.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  24.0, 0.0, 24.0, 0.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: Color(0xFF6D5FED),
                              textStyle: FlutterFlowTheme.of(context)
                                  .titleSmall
                                  .override(
                                    fontFamily: 'Readex Pro',
                                    color: Colors.white,
                                    letterSpacing: 0.0,
                                  ),
                              elevation: 3.0,
                              borderSide: BorderSide(
                                color: Colors.transparent,
                                width: 1.0,
                              ),
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              5.0, 0.0, 0.0, 0.0),
                          child: Icon(
                            Icons.download_sharp,
                            color: Color(0xFFF5F7F8),
                            size: 24.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}