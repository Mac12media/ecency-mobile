import React from 'react';
import { View, Platform, ScrollView } from 'react-native';
import get from 'lodash/get';
import { useIntl } from 'react-intl';

// Components
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { BasicHeader, BoostPlaceHolder, ProductItemLine } from '../../../components';

// Container
import { InAppPurchaseContainer } from '../../../containers';

// Styles
import globalStyles from '../../../globalStyles';
import UserRibbon from '../../../components/userRibbon/userRibbon';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { toastNotification } from '../../../redux/actions/uiAction';

const ITEM_SKUS = Platform.select({
  ios: ['099points', '199points', '499points', '999points', '4999points', '9999points'],
  android: ['099points', '199points', '499points', '999points', '4999points', '9999points'],
});

const BoostScreen = ({ route }) => {
  const intl = useIntl();
  const dispatch = useDispatch()

  const username = route.params?.username ?? '';

  const _onPurchaseSuccess = () => {
    dispatch(toastNotification(intl.formatMessage({id:'boost.points_purchase_success'})))
  }

  const _onPurchaseFailure = (error) => {
    dispatch(toastNotification(intl.formatMessage({id:'boost.points_purchase_fail_msg'}, {message:error.message})))
  }

  return (
    <InAppPurchaseContainer route={route} skus={ITEM_SKUS} handleOnPurchaseSuccess={_onPurchaseSuccess} handleOnPurchaseFailure={_onPurchaseFailure}>
      {({ buyItem, productList, isLoading, isProcessing, getTitle }) => (
        <View style={globalStyles.container}>
          <BasicHeader
            disabled={isProcessing}
            title={intl.formatMessage({
              id: 'boost.title',
            })}
          />
          {username ? (
            <UserRibbon username={username} containerStyle={styles.userRibbonContainer} />
          ) : null}
          {isLoading ? (
            <BoostPlaceHolder />
          ) : (
            <ScrollView contentContainerStyle={styles.listContainer}>
              {productList.map((product) => (
                <ProductItemLine
                  key={get(product, 'title')}
                  isLoading={isLoading}
                  disabled={isProcessing}
                  product={product}
                  title={getTitle(get(product, 'title'))}
                  handleOnButtonPress={(id) => buyItem(id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </InAppPurchaseContainer>
  );
};

export default gestureHandlerRootHOC(BoostScreen);
