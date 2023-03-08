/**
 * 
 */
export const SettingInfoMatSliderValue = {

    //セッティングネイム
    SettingName:{
        MAXLENGTH:100,
        CDKAUTOSIZEMINROWS:1,
        CDKAUTOSIZEMAXROWS:5
    },

    //概要
    Outline:{
        MAXLENGTH:700,
        CDKTEXTAREAAUTOSIZE:700,
        ROWS:5,
        COLS:40,
        CDKAUTOSIZEMINROWS:1,
        CDKAUTOSIZEMAXROWS:5       
    },

    //パワーステリング
    PowerSteering:{
        TICKINTERVAL:10,
        STEP:1,
        MIN:0,
        MAX:100
    },

    //デブギア
    Diffgear:{
        TICKINTERVAL:10,
        STEP:1,
        MIN:0,
        MAX:100        
    },

    //フロントタイヤの圧力
    FrontTirePressure:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:10,
        MAX:45         
    },

    //リアタイヤの圧力
    RearTirePressure:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:10,
        MAX:45
    },

    //ファイナルドライブ
    GearFinal:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:2.2,
        MAX:6.1
    },

    //1速
    GearOne:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6
    },

    //2速
    GearTwo:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6
    },

    //3速
    GearThree:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6    
    },

    //4速
    GearFour:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6         
    },

    //5速
    GearFive:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6         
    },

    //6速
    GearSix:{
        TICKINTERVAL:10,
        STEP:0.01,
        MIN:0.5,
        MAX:6         
    },

    //スタビライザー前軸
    StabiliserAgo:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:0.1,
        MAX:1     
    },

    //スタビライザー後軸
    StabiliserAfter:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:0.1,
        MAX:1
    },

    //最大舵角
    MaxRudderAngle:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:40,
        MAX:60        
    },

    //アッカーマンアングル
    AckermannAngle:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:0.1,
        MAX:1        
    },

    //フロントネガティブキャンバー
    CamberAgo:{
        TICKINTERVAL:5,
        STEP:0.1,
        MIN:-10,
        MAX:0
    },

    //リアネガティブキャンバー
    CamberAfter:{
        TICKINTERVAL:5,
        STEP:0.1,
        MIN:-10,
        MAX:0
    },

    //BREAKE POWER
    BreakPower:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:-1,
        MAX:1
    },

    //ブレーキバランス
    BreakBallance:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:-1,
        MAX:1        
    },

    //空気圧
    AirPressure:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:10,
        MAX:45       
    },

    //車高
    CarHigh:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:5,
        MAX:20        
    },

    //オフセット
    Offset:{
        TICKINTERVAL:1,
        STEP:1,
        MIN:0,
        MAX:10
    },

    //ホイールサイズ
    Hoilesize:{
        TICKINTERVAL:1,
        STEP:0.1,
        MIN:-1,
        MAX:1
    }

} as const;