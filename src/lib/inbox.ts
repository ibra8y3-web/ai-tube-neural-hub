import JSZip from 'jszip';

export interface InboxItem {
  id: string;
  type: string;
  timestamp: number;
  content: string;
  metadata?: any;
}

export const saveToInbox = (item: Omit<InboxItem, 'id' | 'timestamp'>) => {
  try {
    const history = JSON.parse(localStorage.getItem('platform_inbox') || '[]');
    const newItem: InboxItem = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };
    localStorage.setItem('platform_inbox', JSON.stringify([newItem, ...history]));
    window.dispatchEvent(new Event('inbox_updated'));
    return newItem;
  } catch (e) {
    console.error("Failed to save to inbox", e);
    return null;
  }
};

export const getInboxItems = (): InboxItem[] => {
  try {
    return JSON.parse(localStorage.getItem('platform_inbox') || '[]');
  } catch (e) {
    return [];
  }
};

export const clearInbox = () => {
  localStorage.setItem('platform_inbox', '[]');
  window.dispatchEvent(new Event('inbox_updated'));
};

export const deleteInboxItem = (id: string) => {
  try {
    const history = JSON.parse(localStorage.getItem('platform_inbox') || '[]');
    const updated = history.filter((item: InboxItem) => item.id !== id);
    localStorage.setItem('platform_inbox', JSON.stringify(updated));
    window.dispatchEvent(new Event('inbox_updated'));
    return true;
  } catch (e) {
    return false;
  }
};

export const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAsZip = async (files: { [filename: string]: string | Blob }, zipName: string) => {
  const zip = new JSZip();
  Object.entries(files).forEach(([name, content]) => {
    zip.file(name, content);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getExtensionForType = (type: string, content?: string, metadata?: any): string => {
  // If we have content, try to detect language based on markers
  if (content) {
    const code = content.toLowerCase().trim();
    
    // Web
    if (code.includes('<!doctype html>') || code.includes('<html') || code.includes('<body')) return 'html';
    if (code.includes('import react') || code.includes('export const') || code.includes('interface ') || code.includes('type ')) {
       if (code.includes('npm') || code.includes('package.json')) return 'ts';
       return 'ts';
    }
    if (code.includes('body {') || code.includes('.class {') || code.includes('display: flex')) return 'css';
    if (code.includes('$') && (code.includes('.scss') || code.includes('@import'))) return 'scss';

    // Languages (Programming)
    if (code.includes('import ') && code.includes('def ') && code.includes(':')) return 'py';
    if (code.includes('require ') && code.includes('class ') && code.includes('end')) return 'rb';
    if (code.includes('using namespace std;') || code.includes('#include <iostream>')) return 'cpp';
    if (code.includes('#include <stdio.h>') || code.includes('int main(')) return 'c';
    if (code.includes('public class ') && code.includes('public static void main')) return 'java';
    if (code.includes('<?php')) return 'php';
    if (code.includes('import ') && code.includes('func main()')) return 'go';
    if (code.includes('fn main()') || code.includes('use std::')) return 'rs';
    if (code.includes('using system;') && code.includes('namespace ')) return 'cs';
    if (code.includes('import foundation') || code.includes('@main')) return 'swift';
    if (code.includes('import package:flutter') || code.includes('void main()')) return 'dart';
    if (code.includes('fun main()') || code.includes('data class')) return 'kt';
    if (code.includes('object ') && code.includes('def main')) return 'scala';
    if (code.includes('sub ') && code.includes('my $')) return 'pl';
    if (code.includes('module ') && code.includes('where ') && code.includes('main = ')) return 'hs';
    if (code.includes('-module(') && code.includes('-export([')) return 'erl';
    if (code.includes('defmodule ') && code.includes('def ')) return 'ex';
    if (code.includes('(ns ') && code.includes('(defn ')) return 'clj';
    if (code.includes('open ') && code.includes('let main')) return 'fs';
    if (code.includes('#import <foundation/foundation.h>')) return 'm';
    if (code.includes('module ') && code.includes('initial begin')) return 'v';
    if (code.includes('entity ') && code.includes('architecture ')) return 'vhd';
    if (code.includes('const std = @import("std");')) return 'zig';
    if (code.includes('program ') && code.includes('print *,')) return 'f90';
    if (code.includes('identification division.') && code.includes('program-id.')) return 'cob';
    if (code.includes('program ') && code.includes('begin') && code.includes('end.')) return 'pas';
    if (code.includes('with ') && code.includes('procedure ')) return 'adb';
    if (code.includes('(defun ') || code.startsWith('(')) return 'lisp';
    if (code.includes(':- ') || code.includes('?- ')) return 'pl';
    if (code.includes('function ') && code.includes('ans = ')) return 'm';

    // Scripting
    if (code.startsWith('#!') && (code.includes('/bin/bash') || code.includes('/bin/sh'))) return 'sh';
    if (code.includes('$psversiontable') || code.includes('write-host')) return 'ps1';
    if (code.includes('local ') && code.includes('function ') && code.includes('end')) return 'lua';
    if (code.includes('section .text') || code.includes('global _start')) return 'asm';

    // Data & Config
    if (code.startsWith('{') && code.endsWith('}')) return 'json';
    if (code.startsWith('[') && code.endsWith(']')) return 'json';
    if (code.includes('---') && code.includes(': ')) return 'yaml';
    if (code.includes('<?xml')) return 'xml';
    if (code.includes('|') && code.includes('\n') && code.includes('-')) return 'md';
    if (code.includes('# ') && code.includes('## ')) return 'md';
    if (code.includes('\begin{document}')) return 'tex';
    if (code.includes('[') && code.includes(']') && code.includes('=') && !code.startsWith('[')) return 'toml';
    if (code.includes(' [') && code.includes('] ') && code.includes('=')) return 'ini';
    if (code.includes('export ') && code.includes('=')) return 'env';
    if (code.includes(';') && (code.includes('.csv') || code.includes(','))) {
        if (code.split('\n')[0].includes(',')) return 'csv';
    }

    // Databases
    if (code.includes('select ') && code.includes('from ') && code.includes('where ')) return 'sql';
    if (code.includes('query ') || code.includes('mutation ')) return 'graphql';

    // Others
    if (code.includes('contract ') && code.includes('pragma solidity')) return 'sol';
    if (code.includes('library(') && code.includes('<-')) return 'r';
    if (code.includes('%!ps-adobe-')) return 'ps';
    if (code.includes('module ') && code.includes('export class')) return 'ts';
  }

  // Fallback to type mapping
  switch (type) {
    case 'devops': return 'sh';
    case 'architecture': return 'json';
    case 'logic': return 'py';
    case 'code': return 'py';
    case 'legal': return 'txt';
    case 'ux_audit': return 'json';
    case 'voice': return 'wav';
    case 'content': return 'md';
    case 'data': return 'csv';
    case 'academy': return 'json';
    case '3d': return 'glb';
    case 'video': return 'mp4';
    case 'music': return 'mp3';
    default: return 'txt';
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
