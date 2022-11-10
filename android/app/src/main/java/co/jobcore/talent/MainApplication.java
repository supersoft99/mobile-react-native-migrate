package co.jobcore.talent;

import android.app.Application;

import com.facebook.react.ReactApplication;
//import com.RNFetchBlob.RNFetchBlobPackage;
//import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
//import org.wonday.pdf.RCTPdfView;
//import com.reactnativecommunity.progressview.RNCProgressViewPackage;
//import com.reactnativecommunity.androidprogressbar.RNCProgressBarPackage;
//import com.rnfs.RNFSPackage;
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
//import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
// import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
//            new RNFetchBlobPackage(),
//            new RNVersionCheckPackage(),
//            new RCTPdfView(),
//            new RNCProgressViewPackage(),
//            new RNCProgressBarPackage(),
//            new RNFSPackage(),
            new ReactToolbarPackage(),
//            new ReactNativeConfigPackage(),
            new RNDateTimePickerPackage(),
            new RNDeviceInfo(),
              new RNCWebViewPackage(),
            new RSSignatureCapturePackage(),
            new VectorIconsPackage(),
            new FingerprintAuthPackage(),
            new RNI18nPackage(),
            new RNFirebasePackage(),
            new NetInfoPackage(),
            new AsyncStoragePackage(),
            new ImagePickerPackage(),
            // new DocumentPickerPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}