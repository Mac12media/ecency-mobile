import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { ComponentType, Fragment } from 'react';
import styles from './children.styles';
import { Icon, MainButton, SimpleChart, TextButton } from '../../../components';
import { COIN_IDS } from '../../../constants/defaultCoins';
import { useIntl } from 'react-intl';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface CoinCardProps {
    id:string;
    chartData:number[];
    name:string;
    notCrypto:boolean;
    symbol:string;
    currencySymbol:string;
    changePercent:number;
    currentValue:number;
    ownedTokens:number;
    unclaimedRewards:string;
    enableBuy?:boolean;
    footerComponent:ComponentType<any>
    onPress:()=>void
}

export const CoinCard = ({
  id,
  notCrypto, 
  chartData, 
  name,
  currencySymbol,
  symbol,
  changePercent,
  currentValue,
  ownedTokens,
  footerComponent,
  unclaimedRewards,
  enableBuy,
  onPress
}:CoinCardProps) => {

  if(!notCrypto && !chartData.length){
    return null
  }

  const intl = useIntl();

    const _renderHeader = (
        <View style={styles.cardHeader}>
            {/* <View style={styles.logo} /> */}
            <View style={styles.cardTitleContainer}>
                <Text style={styles.textTitle} >{symbol}</Text>
                <Text style={styles.textSubtitle}>{name}</Text>
            </View>
            <Text  
              style={styles.textCurValue}>
                <Text style={{fontWeight:'500'}}>{`${ownedTokens.toFixed(3)} ${symbol}`}</Text>
                {`/${(ownedTokens * currentValue).toFixed(2)}${currencySymbol}`}
            </Text>
        </View>
    );

    const _renderClaimSection = () => {
      if(unclaimedRewards || enableBuy){
        const btnTitle = unclaimedRewards
          ? unclaimedRewards
          : intl.formatMessage({ id: `wallet.${id}.buy`});
        return (
          <View style={styles.claimContainer}>
            <MainButton
              isLoading={false}
              isDisable={false}
              style={styles.claimBtn}
              height={50}
              onPress={() => {}}
            >
              <Fragment>
                <Text style={styles.claimBtnTitle}>
                  {btnTitle}
                </Text>
                <View style={styles.claimIconWrapper}>
                  <Icon name="add" iconType="MaterialIcons" color={EStyleSheet.value('$primaryBlue')} size={23} />
                </View>
              </Fragment>
            </MainButton>
          </View>
        )
      }
    }


    const _renderGraph = () => {
      const _baseWidth = Dimensions.get("window").width - 32;
      return (
        <View style={styles.chartContainer}>
          <SimpleChart 
            data={chartData}
            baseWidth={_baseWidth}
            showLine={false}
            chartHeight={130}
          />
        </View>
    )}

    const _renderFooter = (
      <View style={styles.cardFooter}>
        <Text style={styles.textCurValue}>{`${currencySymbol} ${currentValue.toFixed(2)}`}</Text>
        <Text style={ changePercent > 0 ? styles.textDiffPositive : styles.textDiffNegative}>{`${changePercent > 0 ? '+':''}${changePercent.toFixed(1)}%`}</Text>
      </View>
    )

  return (
    <TouchableOpacity onPress={onPress} >
      <View style={styles.cardContainer}>
        {_renderHeader}
        {_renderClaimSection()}
        {!notCrypto  && _renderGraph()}
        {!notCrypto ? _renderFooter : <View style={{height:12}} />}
        {footerComponent && footerComponent}
      </View>
      
    </TouchableOpacity>

  );
};

