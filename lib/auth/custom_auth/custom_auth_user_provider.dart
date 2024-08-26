import 'package:rxdart/rxdart.dart';

import 'custom_auth_manager.dart';

class NwuHmsAuthUser {
  NwuHmsAuthUser({required this.loggedIn, this.uid});

  bool loggedIn;
  String? uid;
}

/// Generates a stream of the authenticated user.
BehaviorSubject<NwuHmsAuthUser> nwuHmsAuthUserSubject =
    BehaviorSubject.seeded(NwuHmsAuthUser(loggedIn: false));
Stream<NwuHmsAuthUser> nwuHmsAuthUserStream() =>
    nwuHmsAuthUserSubject.asBroadcastStream().map((user) => currentUser = user);
