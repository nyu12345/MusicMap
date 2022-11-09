import React, { useCallback, useState, useMemo, useRef } from 'react';
import { Dimensions, Text, View, StyleSheet, SafeAreaView } from 'react-native'; 
import * as MediaLibrary from 'expo-media-library';

export function LoadImages() {
    print(MediaLibrary.getPermissionsAsync);
    return (
        <View>
            <Button title="Load Images" onPress={this._handleButtonPress} />
            <ScrollView>
                {this.state.photos.map((p, i) => {
                    return (
                        <Image
                            key={i}
                            style={{
                                width: 300,
                                height: 100,
                            }}
                            source={{ uri: p.node.image.uri }}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}