import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LED Controller',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        brightness: Brightness.dark,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // =================================================================
  // APNA RENDER SERVER KA URL YAHAAN DAALO (IMPORTANT)
  // =================================================================
  final String serverUrl = "https://radhapro-led-server.onrender.com";
  // =================================================================

  String _statusMessage = "Ready";

  void _sendRequest(String command) async {
    setState(() {
      _statusMessage = "Sending $command command...";
    });

    try {
      final response = await http.get(Uri.parse('$serverUrl/led-$command'));
      if (response.statusCode == 200) {
        setState(() {
          _statusMessage = "LED $command command sent successfully!";
        });
      } else {
        setState(() {
          _statusMessage = "Error: Server returned status ${response.statusCode}";
        });
      }
    } catch (e) {
      setState(() {
        _statusMessage = "Error: Failed to connect to server. Check internet.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ESP32 LED Controller'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Icon(Icons.lightbulb_outline, size: 100, color: Colors.yellow),
            const SizedBox(height: 40),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 20),
                textStyle: const TextStyle(fontSize: 24),
                backgroundColor: Colors.green,
              ),
              onPressed: () {
                _sendRequest('on');
              },
              child: const Text('ON'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 20),
                textStyle: const TextStyle(fontSize: 24),
                backgroundColor: Colors.red,
              ),
              onPressed: () {
                _sendRequest('off');
              },
              child: const Text('OFF'),
            ),
            const SizedBox(height: 40),
            Text(
              _statusMessage,
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}