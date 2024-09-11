// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class UserStruct extends BaseStruct {
  UserStruct({
    String? userType,
  }) : _userType = userType;

  // "userType" field.
  String? _userType;
  String get userType => _userType ?? '';
  set userType(String? val) => _userType = val;

  bool hasUserType() => _userType != null;

  static UserStruct fromMap(Map<String, dynamic> data) => UserStruct(
        userType: data['userType'] as String?,
      );

  static UserStruct? maybeFromMap(dynamic data) =>
      data is Map ? UserStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'userType': _userType,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'userType': serializeParam(
          _userType,
          ParamType.String,
        ),
      }.withoutNulls;

  static UserStruct fromSerializableMap(Map<String, dynamic> data) =>
      UserStruct(
        userType: deserializeParam(
          data['userType'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'UserStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is UserStruct && userType == other.userType;
  }

  @override
  int get hashCode => const ListEquality().hash([userType]);
}

UserStruct createUserStruct({
  String? userType,
}) =>
    UserStruct(
      userType: userType,
    );
