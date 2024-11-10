#!/usr/bin/env bash

# Get current script directory
EXAMPLES_DIR=$(dirname "$0")

pnpm tsx $EXAMPLES_DIR/$1.ts
