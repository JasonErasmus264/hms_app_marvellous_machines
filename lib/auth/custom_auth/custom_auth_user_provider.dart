import 'package:rxdart/rxdart.dart';

import '/backend/schema/structs/index.dart';
import 'custom_auth_manager.dart';

class NwuHmsAuthUser {
  NwuHmsAuthUser({
    required this.loggedIn,
    this.uid,
    this.userData,
  });

  bool loggedIn;
  String? uid;
  UserStruct? userData;
}

/// Generates a stream of the authenticated user.
BehaviorSubject<NwuHmsAuthUser> nwuHmsAuthUserSubject =
    BehaviorSubject.seeded(NwuHmsAuthUser(loggedIn: false));
Stream<NwuHmsAuthUser> nwuHmsAuthUserStream() =>
    nwuHmsAuthUserSubject.asBroadcastStream().map((user) => currentUser = user);
