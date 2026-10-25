import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rupa_tokens/rupa_tokens.dart';

void main() {
  test('every brand has light and dark colors', () {
    for (final brand in RupaBrand.values) {
      for (final mode in RupaMode.values) {
        expect(RupaColors.of(brand, mode).series, hasLength(5), reason: '$brand/$mode');
      }
    }
  });

  test('values match the web tokens', () {
    final iris = RupaColors.of(RupaBrand.iris, RupaMode.light);
    expect(iris.primary, const Color(0xFF6340ED));
    expect(iris.canvas, const Color(0xFFF7F6FB));
    expect(RupaColors.of(RupaBrand.iris, RupaMode.dark).primary, const Color(0xFF7759F4));
    // #rrggbbaa on the web is 0xAARRGGBB here
    expect(RupaColors.of(RupaBrand.violet, RupaMode.dark).overlay, const Color(0xA3000000));
    expect(RupaSpace.s1p5, 6);
    expect(RupaRadius.xxl, 18);
  });

  test('RupaMode follows Brightness', () {
    expect(RupaMode.of(Brightness.dark), RupaMode.dark);
    expect(RupaMode.of(Brightness.light), RupaMode.light);
  });

  test('lerp blends and copyWith overrides', () {
    final a = RupaColors.of(RupaBrand.iris, RupaMode.light);
    final b = RupaColors.of(RupaBrand.iris, RupaMode.dark);
    expect(a.lerp(b, 0).canvas, a.canvas);
    expect(a.lerp(b, 1).canvas, b.canvas);
    expect(a.copyWith(primary: const Color(0xFF000000)).primary, const Color(0xFF000000));
    expect(a.copyWith().ink, a.ink);
  });

  test('shadows are tinted with the brand shadow color', () {
    final c = RupaColors.of(RupaBrand.iris, RupaMode.light);
    expect(c.shadowCard, hasLength(2));
    expect(c.shadowCard.first.color, c.shadow.withValues(alpha: 0.04));
    expect(c.shadowPop.single.blurRadius, 40);
  });

  testWidgets('context.rupa reads the theme extension', (tester) async {
    late RupaColors read;
    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData(extensions: [RupaColors.of(RupaBrand.iris, RupaMode.light)]),
        home: Builder(builder: (context) {
          read = context.rupa;
          return const SizedBox();
        }),
      ),
    );
    expect(read.primary, const Color(0xFF6340ED));
  });
}
