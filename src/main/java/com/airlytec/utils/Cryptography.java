package com.airlytec.utils;

public class Cryptography {
  public static String cryptography(String str) {
    char[] chars = str.toCharArray();

    for (int i = 0, len = chars.length; i < len; i++) {
      chars[i] = (char) (chars[i] ^ 10);
    }
    return new String(chars);
  }
}