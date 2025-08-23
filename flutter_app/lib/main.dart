 import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
void main() { runApp(const MyApp()); }
class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LED Controller',
      theme: ThemeData(primarySwatch: Colors.indigo),
      home: const LedControlPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}
class LedControlPage extends StatefulWidget {
  const LedControlPage({super.key});
  @override
  State<LedControlPage> createState() => _LedControlPageState();
}
class _LedControlPageState extends State<LedControlPage> {
  bool _isLedOn = false; 
  String _message = "Press the button to control LED";
  bool _isLoading = false;
  // SERVER URL ABHI KHAALI CHHOD DO, HUM BAAD ME BHARENGE
  final String _serverUrl = "https://led-control-project.onrender.com/set-status";
  Future<void> _toggleLed() async {
    setState(() {
      _isLoading = true;
      _message = "Sending command...";
    });
    final String newState = _isLedOn ? "OFF" : "ON";
    try {
      final url = Uri.parse(_serverUrl);
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'status': newState}),
      ).timeout(const Duration(seconds: 20));
      if (response.statusCode == 200) {
        setState(() {
          _isLedOn = !_isLedOn;
          _message = "LED is now ${_isLedOn ? 'ON' : 'OFF'}";
        });
      } else {
        setState(() {
          _message = "Error: Server rejected the command";
        });
      }
    } catch (e) {
      setState(() {
        _message = "Error: Check connection or server URL";
      });
    }
    setState(() { _isLoading = false; });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( title: const Text('ESP32 LED Controller'), ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(
              Icons.lightbulb,
              size: 200,
              color: _isLedOn ? Colors.yellow.shade700 : Colors.grey.shade400,
            ),
            const SizedBox(height: 30),
            Text( _message, style: const TextStyle(fontSize: 18), ),
            const SizedBox(height: 50),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _toggleLed, 
                    style: ElevatedButton.styleFrom(
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(40),
                      backgroundColor: _isLedOn ? Colors.redAccent : Colors.green,
                    ),
                    child: Text(
                      _isLedOn ? 'TURN OFF' : 'TURN ON',
                      style: const TextStyle(fontSize: 18, color: Colors.white),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}